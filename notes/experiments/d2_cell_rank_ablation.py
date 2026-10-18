"""Train M=12/25 module-one ablations with matched data and update budgets.

N=50, training masks/scaling, seed, Adam settings and core-inference ridge
are shared. Checkpoint selection uses held-out entries WITHIN the training
prefix. Chronological validation uses observed-only independent core solves.
No temporal-test or held-out entry-test scores are computed. This is reconstruction, NOT
future forecasting; M=25 is an explicit non-paper diagnostic ablation.
"""

import argparse
import gc
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

import d2_module1_gpu
from d2_transformer_gpu import forecast_origins, load_inputs, soh_scores, window_indices


def validation_metrics(prediction, data, history=25, horizon=5):
    """Capacity reconstruction metrics; use the predictor's window weighting."""
    train_end, val_end, _ = map(int, data['boundaries'])
    expected = (*data['X_norm'].shape[:2], val_end - train_end)
    if prediction.shape != expected or not np.isfinite(prediction).all():
        raise ValueError('Invalid validation capacity reconstruction.')
    offset, scale = [float(data[key][2]) for key in ('normalization_offsets', 'normalization_scales')]
    target = data['X_norm'][:, :, 2, train_end:val_end]
    available = data['available'][:, :, 2, train_end:val_end]
    observed = data['observed'][:, :, 2, train_end:val_end]
    error = (prediction - target).astype(np.float64) * scale
    curve = {}
    for name, mask in [('available', available), ('observed', observed), ('hidden', available & ~observed)]:
        curve[name] = float(np.sqrt(np.mean(error[mask] ** 2))) if mask.any() else None
    cap0 = np.where(data['available'][:, :, 2, 0], data['X_norm'][:, :, 2, 0] * scale + offset, -np.inf).max(axis=1)
    cap0 = np.where(np.isfinite(cap0) & (cap0 > 0), cap0, np.nan)
    true_peak = np.where(available, target, -np.inf).max(axis=1) * scale + offset
    true_peak = np.where(available.any(axis=1) & (true_peak > 0), true_peak, np.nan)
    pred_peak = prediction.max(axis=1) * scale + offset
    origins = forecast_origins(data['boundaries'], history, horizon)['val']
    _, target_cycles = window_indices(origins, history, horizon)
    indices = target_cycles - train_end
    with np.errstate(invalid='ignore', divide='ignore'):
        truth = true_peak[:, indices].transpose(1, 2, 0) / cap0[None, None, :] * 100.
        pred = pred_peak[:, indices].transpose(1, 2, 0) / cap0[None, None, :] * 100.
    valid = np.isfinite(truth) & np.isfinite(pred)
    soh = soh_scores(pred, truth, valid)
    soh['signed_bias_pp'] = float((pred - truth)[valid].mean())
    return {'capacity_curve_rmse_mAh': curve, 'soh': soh}


def infer_validation_capacity(a_np, b_np, data, ridge, batch, device_name):
    """Frozen-factor ridge, using only observed validation capacity entries."""
    import torch

    train_end, val_end, _ = map(int, data['boundaries'])
    x = data['X_norm'][:, :, 2, train_end:val_end]
    w_np = data['observed'][:, :, 2, train_end:val_end]
    y_np = np.ascontiguousarray(x.transpose(2, 0, 1)).reshape(x.shape[-1], -1)
    weights = np.ascontiguousarray(w_np.transpose(2, 0, 1)).reshape(y_np.shape)
    result = np.empty_like(x)
    device = torch.device(device_name)
    with torch.no_grad():
        a, b = [torch.as_tensor(value, dtype=torch.float32, device=device) for value in (a_np, b_np)]
        design = torch.einsum('im,jn->ijmn', a, b).reshape(a.shape[0] * b.shape[0], -1)
        eye = ridge * torch.eye(design.shape[1], dtype=torch.float32, device=device)
        for start in range(0, len(y_np), batch):
            end = min(start + batch, len(y_np))
            weights_t = torch.as_tensor(weights[start:end], dtype=torch.float32, device=device)
            # Hide unobserved values BEFORE arithmetic. They do not enter solves.
            y = torch.as_tensor(y_np[start:end], dtype=torch.float32, device=device)
            y = torch.where(weights_t.bool(), y, 0.)
            lhs = design.T @ (design[None] * weights_t[:, :, None]) + eye
            rhs = y @ design
            coefficients = torch.linalg.solve(lhs, rhs.unsqueeze(-1)).squeeze(-1)
            decoded = coefficients @ design.T
            if not torch.isfinite(decoded).all():
                raise RuntimeError('Non-finite capacity solve.')
            result[:, :, start:end] = decoded.reshape(end - start, a.shape[0], b.shape[0]).permute(1, 2, 0).cpu().numpy()
            if start == 0 or end == len(y_np):
                print(f'  Validation capacity solves: {end}/{len(y_np)}', flush=True)
    return result


def check_training_protocol(prepared, data):
    x, train, val, entry_test, available, offsets, scales, limit = prepared
    train_end = int(data['boundaries'][0])
    if x.shape[-1] != train_end or limit != train_end:
        raise ValueError('Training prefix does not match the existing experiment.')
    np.testing.assert_array_equal(train, data['observed'][:, :, :, :train_end])
    np.testing.assert_array_equal(available, data['available'][:, :, :, :train_end])
    np.testing.assert_allclose(offsets, data['normalization_offsets'], rtol=1e-10, atol=1e-10)
    np.testing.assert_allclose(scales, data['normalization_scales'], rtol=1e-10, atol=1e-10)
    np.testing.assert_allclose(x, data['X_norm'][:, :, :, :train_end], rtol=1e-6, atol=1e-6)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inputs', type=Path, required=True)
    parser.add_argument('--data', type=Path, default=Path(__file__).resolve().parent / 'datasets' / 'D2_tensor.npy')
    parser.add_argument('--device', default='cuda:0')
    parser.add_argument('--steps', type=int, default=1500)
    parser.add_argument('--lr', type=float, default=.003)
    parser.add_argument('--batch', type=int, default=4)
    args = parser.parse_args()
    if args.steps < 1 or args.lr <= 0 or args.batch < 1:
        parser.error('Require positive steps, lr, batch.')
    data, metadata = load_inputs(args.inputs)
    train_end, val_end, total = map(int, data['boundaries'])
    if data['X_norm'].shape[:2] != (25, 100):
        raise ValueError('This diagnostic is for D2 with 25 cells and 100 samples.')
    seed, missing, ridge = int(metadata['seed']), float(metadata['missing_ratio']), float(metadata['ridge'])
    if ridge <= 0:
        raise ValueError('Require the positive ridge coefficient from the aligned input experiment.')
    prepared = d2_module1_gpu.prepare_data(args.data, train_end, missing, seed, 'minmax')
    check_training_protocol(prepared, data)
    del prepared
    print('PASS: training masks, normalized values and scaling match existing inputs.', flush=True)
    print('Fit M=12 and M=25 with N=50; matched seed, masks, scaling, updates, Adam and regularization.')
    print('Entry-validation selects checkpoints; chronological validation capacity is scored only after fitting.')
    print('M=25 is NOT the paper setting. This experiment does NOT train a codec/forecaster or score test periods.', flush=True)
    out = Path(__file__).resolve().parent / 'runs' / ('cell_rank_ablation_' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S_%fZ'))
    out.mkdir(parents=True, exist_ok=False)
    with np.load(args.inputs, allow_pickle=False) as archive:
        old_core = archive['G_all'][:, :, 2, train_end:val_end]
    old_pred = np.einsum('im,jn,mnt->ijt', data['A'], data['B'], old_core, optimize=True)
    scores = {'existing_M12_reference': validation_metrics(old_pred, data)}
    np.save(out / 'existing_M12_validation_capacity.npy', old_pred, allow_pickle=False)
    checkpoints = {}
    import torch

    for rank in (12, 25):
        print(f'\nFITTING M={rank}, N=50', flush=True)
        checkpoint_dir = d2_module1_gpu.main([
            '--data', str(args.data), '--cycles', str(train_end), '--ranks', str(rank), '50',
            '--normalization', 'minmax', '--missing-ratio', str(missing), '--seed', str(seed),
            '--steps', str(args.steps), '--lr', str(args.lr), '--lambda-reg', str(ridge),
            '--device', args.device, '--skip-test-evaluation'])
        gc.collect()
        if args.device.startswith('cuda'):
            torch.cuda.empty_cache()
        with np.load(checkpoint_dir / 'module1_gpu.npz', allow_pickle=False) as archive:
            a, b = archive['U1'], archive['U2']
        fit_summary = json.loads((checkpoint_dir / 'summary.json').read_text(encoding='utf-8'))
        if fit_summary['entry_test_evaluated'] is not False:
            raise RuntimeError('Unexpected test-entry evaluation in validation ablation.')
        prediction = infer_validation_capacity(a, b, data, ridge, args.batch, args.device)
        score = validation_metrics(prediction, data)
        effective_ranks = {}
        for name, factor in [('A', a), ('B', b)]:
            singular = np.linalg.svd(factor.astype(np.float64), compute_uv=False)
            effective_ranks[name] = int((singular > singular[0] * 1e-6).sum())
        score.update({'best_training_prefix_entry_validation_step': fit_summary['best_step'],
                      'training_prefix_entry_validation_rmse': fit_summary['best_val_rmse'],
                      'parameter_count': int(a.size + b.size + rank * 50 * 3 * train_end),
                      'effective_factor_ranks_at_rcond_1e_6': effective_ranks,
                      'selected_checkpoint_at_update_budget': fit_summary['best_step'] == args.steps})
        scores[f'refit_M{rank}'] = score
        checkpoints[str(rank)] = str((checkpoint_dir / 'module1_gpu.npz').resolve())
        np.save(out / f'M{rank}_validation_capacity.npy', prediction, allow_pickle=False)
        gc.collect()
        if args.device.startswith('cuda'):
            torch.cuda.empty_cache()
    summary = {'experiment': 'module_one_cell_rank_validation_ablation_NOT_forecast',
               'inputs': str(args.inputs.resolve()), 'raw_data': str(args.data.resolve()),
               'seed': seed, 'missing_ratio': missing, 'normalization': 'train-observed minmax',
               'fixed_N': 50, 'M_values': [12, 25], 'steps_per_model': args.steps,
               'learning_rate': args.lr, 'regularization_and_core_ridge': ridge,
               'checkpoint_selection': 'held-out entry RMSE within TRAINING prefix; not chronological validation or test',
               'module_one_checkpoints': checkpoints, 'validation': scores,
               'test_evaluated': False, 'codec_or_forecaster_trained': False,
               'limitations': ['M=25 is a non-paper diagnostic ablation',
                               'equal update counts do not establish convergence',
                               'parameter count and total L2 penalty change with rank',
                               'SOH rows are same-cycle reconstruction diagnostics, not forecasts']}
    (out / 'summary.json').write_text(json.dumps(summary, indent=2, allow_nan=False), encoding='utf-8')
    print('\nVALIDATION SUMMARY: same-cycle reconstruction, NOT forecasting')
    for name, score in scores.items():
        print(f"{name:24s} | capacity curve RMSE={score['capacity_curve_rmse_mAh']['available']:.3f} mAh | SOH MAE={score['soh']['mae_pp']:.3f} pp | bias={score['soh']['signed_bias_pp']:+.3f} pp | n={score['soh']['count']}")
        if name.startswith('refit'):
            print('  Selected entry-validation step:', score['best_training_prefix_entry_validation_step'],
                  '| parameters:', score['parameter_count'],
                  '| effective ranks:', score['effective_factor_ranks_at_rcond_1e_6'],
                  '| checkpoint at update budget:', score['selected_checkpoint_at_update_budget'])
    print('M=25 improves validation SOH over refit M=12:', scores['refit_M25']['soh']['mae_pp'] < scores['refit_M12']['soh']['mae_pp'])
    print('No temporal/entry-test scores computed; no existing run overwritten.')
    print('Saved:', out, flush=True)


if __name__ == '__main__':
    main()
