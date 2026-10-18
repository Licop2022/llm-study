"""D2 Tucker2 + masked squared error + L2 + Adam, starting with 100 cycles.

This is a module-one completion pilot, NOT full paper/SOH forecasting results.
Only the first 70% chronological block is eligible for fitting. Within the
chosen prefix, originally available entries are split into train/val/test.
Zero-valued individual measurements remain valid. As in the existing data
pipeline, an entire cell-cycle that is all zero is treated as missing.
"""

import argparse
import json
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np


def prepare_data(path, cycles, missing_ratio, seed, normalization='zscore'):
    """Fit scaling to training entries alone; never use held-out entry values."""
    raw = np.load(path, mmap_mode='r', allow_pickle=False)
    if raw.ndim != 4 or raw.shape[2] != 3:
        raise ValueError('Expected (cell, sample, 3 features, cycle).')
    fit_limit = int(raw.shape[3] * 0.70)
    if not 1 <= cycles <= fit_limit:
        raise ValueError(f'--cycles must be 1..{fit_limit}; later cycles are reserved.')
    if not 0 < missing_ratio < 1:
        raise ValueError('--missing-ratio must be between 0 and 1.')
    if normalization not in ('zscore', 'minmax'):
        raise ValueError('normalization must be zscore or minmax.')
    block = np.array(raw[:, :, :, :cycles], dtype=np.float32, copy=True)
    absent_cycles = np.all(block == 0, axis=(1, 2), keepdims=True)
    available = np.isfinite(block) & ~absent_cycles
    uniform = np.random.default_rng(seed).random(block.shape)
    train = available & (uniform < 1 - missing_ratio)
    val = available & (uniform >= 1 - missing_ratio) & (uniform < 1 - missing_ratio / 2)
    test = available & (uniform >= 1 - missing_ratio / 2)
    if not all(mask.any() for mask in (train, val, test)):
        raise ValueError('An entry split is empty; use more cycles.')
    offsets, scales = [], []
    for feature in range(block.shape[2]):
        observed = block[:, :, feature, :][train[:, :, feature, :]].astype(np.float64)
        if len(observed) < 2:
            raise ValueError('Not enough training observations for a feature.')
        if normalization == 'zscore':
            offset, scale = float(observed.mean()), float(observed.std())
        else:
            offset = float(observed.min())
            scale = float(observed.max()) - offset
        if scale < 1e-8:
            raise ValueError('A feature has near-zero training scale.')
        offsets.append(offset)
        scales.append(scale)
    offsets = np.asarray(offsets)
    scales = np.asarray(scales)
    # Replace unavailable entries before arithmetic, avoiding NaN propagation.
    safe = np.where(available, block, offsets[None, None, :, None])
    normalized = ((safe - offsets[None, None, :, None]) /
                  scales[None, None, :, None]).astype(np.float32)
    # Held-out values are NOT clipped; they may lie outside training bounds.
    return normalized, train, val, test, available, offsets, scales, fit_limit


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data', type=Path, default=Path(__file__).resolve().parent / 'datasets' / 'D2_tensor.npy')
    parser.add_argument('--cycles', type=int, default=100)
    # Paper section 4.2: D2 representation ranks M=12, N=50.
    # Section 4.6.3's (9,25,3) instead refers to feature-extraction ranks.
    parser.add_argument('--ranks', nargs=2, type=int, default=[12, 50])
    parser.add_argument('--normalization', choices=['zscore', 'minmax'], default='zscore')
    parser.add_argument('--missing-ratio', type=float, default=0.30)
    parser.add_argument('--steps', type=int, default=300)
    parser.add_argument('--lr', type=float, default=0.003)
    parser.add_argument('--lambda-reg', type=float, default=0.001)
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--device', default='cuda:0')
    parser.add_argument('--skip-test-evaluation', action='store_true',
                        help='For validation-only ablations: do not score held-out entry-test values.')
    args = parser.parse_args(argv)
    if args.steps < 1 or args.lr <= 0 or args.lambda_reg < 0:
        parser.error('Require steps >= 1, lr > 0, lambda-reg >= 0.')
    prepared = prepare_data(args.data, args.cycles, args.missing_ratio, args.seed, args.normalization)
    x_np, tr_np, va_np, te_np, available, offsets, scales, fit_limit = prepared
    r1, r2 = args.ranks
    if not (1 <= r1 <= x_np.shape[0] and 1 <= r2 <= x_np.shape[1]):
        parser.error('Each rank must be within its original mode dimension.')

    import torch

    torch.set_num_threads(2)
    torch.manual_seed(args.seed)
    device = torch.device(args.device)
    if device.type == 'cuda':
        if not torch.cuda.is_available():
            raise RuntimeError('CUDA unavailable; check environment and allocation.')
        torch.cuda.set_device(device)
        torch.backends.cuda.matmul.allow_tf32 = False
        torch.backends.cudnn.allow_tf32 = False
        torch.cuda.reset_peak_memory_stats(device)
        print('GPU:', torch.cuda.get_device_name(device), flush=True)
    elif device.type != 'cpu':
        raise ValueError('Use cpu or cuda:N.')
    x = torch.as_tensor(x_np, device=device)
    masks = {name: torch.as_tensor(mask, device=device) for name, mask in
             [('train', tr_np), ('val', va_np), ('test', te_np)]}
    n_observed = int(tr_np.sum())
    print('D2 shape:', tuple(x.shape), '| ranks:', (r1, r2), '| device:', device)
    print(f'Fitting prefix: cycles 0..{args.cycles - 1}; reserved temporal boundary: {fit_limit}.')
    print('Available entries:', int(available.sum()), '| excluded:', int((~available).sum()))
    print('Entry counts:', {name: int(mask.sum()) for name, mask in
          [('train', tr_np), ('val', va_np), ('test', te_np)]})
    print('Normalization:', args.normalization)
    print('Training-only feature offsets:', offsets.tolist())
    print('Training-only feature scales:', scales.tolist(), flush=True)
    baseline_levels_np = np.array([x_np[:, :, f, :][tr_np[:, :, f, :]].mean()
                                   for f in range(x_np.shape[2])], dtype=np.float32)
    baseline_levels = torch.as_tensor(baseline_levels_np, device=device)

    # All initialization reads observed training entries only. Missing entries
    # are zero during initialization, not fitted as zero in the loss.
    with torch.no_grad():
        observed_x = torch.where(masks['train'], x, 0.0)
        m1 = observed_x.reshape(x.shape[0], -1)
        m2 = observed_x.permute(1, 0, 2, 3).reshape(x.shape[1], -1)
        _, vectors_a = torch.linalg.eigh(m1 @ m1.T)
        _, vectors_b = torch.linalg.eigh(m2 @ m2.T)
        a0 = vectors_a[:, -r1:].flip(1).contiguous()
        b0 = vectors_b[:, -r2:].flip(1).contiguous()
        projected = torch.einsum('ia,ijkt->ajkt', a0, observed_x)
        g0 = torch.einsum('jb,ajkt->abkt', b0, projected)
        observed_rate = n_observed / int(available.sum())
        g0 = g0 / observed_rate
        del m1, m2, observed_x, projected, vectors_a, vectors_b
    a = torch.nn.Parameter(a0)
    b = torch.nn.Parameter(b0)
    g = torch.nn.Parameter(g0)
    parameters = [a, b, g]
    optimizer = torch.optim.Adam(parameters, lr=args.lr)

    def reconstruct():
        # Explicit contraction order avoids forming the A/B outer product.
        expanded = torch.einsum('abkt,jb->ajkt', g, b)
        return torch.einsum('ia,ajkt->ijkt', a, expanded)

    def evaluate(pred, mask):
        return ((pred[mask] - x[mask]).square().mean()).sqrt().item()

    with torch.no_grad():
        initial = reconstruct()
        initial_train = evaluate(initial, masks['train'])
        best_val = evaluate(initial, masks['val'])
    best_state = [p.detach().clone() for p in parameters]
    best_step = 0
    history = [{'step': 0, 'train_rmse': initial_train, 'val_rmse': best_val}]
    print(f'step   0 | train_RMSE={initial_train:.6f} | val_RMSE={best_val:.6f}', flush=True)
    print('Loss = (observed squared-error SUM + lambda * parameter squared-norm SUM) / observed count.', flush=True)
    started = time.monotonic()
    for step in range(1, args.steps + 1):
        optimizer.zero_grad(set_to_none=True)
        pred = reconstruct()
        fit = (pred[masks['train']] - x[masks['train']]).square().mean()
        regularizer = sum(p.square().sum() for p in parameters) / n_observed
        loss = fit + args.lambda_reg * regularizer
        if not torch.isfinite(loss):
            raise RuntimeError('Non-finite loss; stopping before saving a model.')
        loss.backward()
        grad_norm = torch.nn.utils.clip_grad_norm_(parameters, max_norm=5.0, error_if_nonfinite=True)
        optimizer.step()
        if step == 1 or step % 20 == 0 or step == args.steps:
            with torch.no_grad():
                pred = reconstruct()
                train_rmse = evaluate(pred, masks['train'])
                val_rmse = evaluate(pred, masks['val'])
            if not (np.isfinite(train_rmse) and np.isfinite(val_rmse)):
                raise RuntimeError('Non-finite evaluation; stopping.')
            history.append({'step': step, 'train_rmse': train_rmse, 'val_rmse': val_rmse,
                            'loss': loss.item(), 'grad_norm': grad_norm.item()})
            if val_rmse < best_val:
                best_val, best_step = val_rmse, step
                best_state = [p.detach().clone() for p in parameters]
            print(f'step {step:3d} | train_RMSE={train_rmse:.6f} | val_RMSE={val_rmse:.6f} | '
                  f'elapsed={time.monotonic() - started:.1f}s', flush=True)

    with torch.no_grad():
        for p, saved in zip(parameters, best_state):
            p.copy_(saved)
        pred = reconstruct()
        final_train = evaluate(pred, masks['train'])
        test_rmse, baseline_rmse = None, None
        feature_metrics = []
        if not args.skip_test_evaluation:
            test_rmse = evaluate(pred, masks['test'])
            baseline_diff = x - baseline_levels[None, None, :, None]
            baseline_rmse = (baseline_diff[masks['test']].square().mean()).sqrt().item()
        for feature in ([] if args.skip_test_evaluation else range(x.shape[2])):
            mask = masks['test'][:, :, feature, :]
            if not mask.any():
                feature_metrics.append({'feature': feature, 'test_rmse_normalized': None,
                                        'test_rmse_original_units': None,
                                        'train_mean_baseline_rmse_original_units': None})
                continue
            diff = pred[:, :, feature, :][mask] - x[:, :, feature, :][mask]
            error = diff.square().mean().sqrt().item()
            feature_baseline = baseline_diff[:, :, feature, :][mask].square().mean().sqrt().item()
            feature_metrics.append({'feature': feature, 'test_rmse_normalized': error,
                                    'test_rmse_original_units': float(error * scales[feature]),
                                    'train_mean_baseline_rmse_original_units': float(feature_baseline * scales[feature])})

    summary = {'experiment': 'D2_module1_completion_pilot_not_SOH_forecast',
               'implementation_version': '2-paper-ranks-and-normalization-option',
               'config': {k: str(v) if isinstance(v, Path) else v for k, v in vars(args).items()},
               'torch_version': torch.__version__, 'cuda_runtime': torch.version.cuda,
               'shape': list(x_np.shape), 'reserved_temporal_boundary': fit_limit,
               'initial_train_rmse': initial_train, 'final_train_rmse': final_train,
               'best_val_rmse': best_val, 'best_step': best_step,
               'test_rmse_normalized': test_rmse, 'train_mean_baseline_rmse_normalized': baseline_rmse,
               'beats_baseline': None if args.skip_test_evaluation else test_rmse < baseline_rmse,
               'entry_test_evaluated': not args.skip_test_evaluation,
               'feature_metrics': feature_metrics,
               'normalization': args.normalization + ', fit only on observed training entries, including legitimate zeros',
               'missing_convention': 'all-zero cell-cycle or nonfinite element excluded',
               'elapsed_seconds': time.monotonic() - started, 'history': history}
    if device.type == 'cuda':
        summary['peak_allocated_mib'] = torch.cuda.max_memory_allocated(device) / 1024 ** 2
    run_id = 'd2_' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S_%fZ')
    out = Path(__file__).resolve().parent / 'runs' / run_id
    out.mkdir(parents=True, exist_ok=False)
    (out / 'summary.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')
    np.savez_compressed(out / 'module1_gpu.npz', U1=a.detach().cpu().numpy(),
                        U2=b.detach().cpu().numpy(), G=g.detach().cpu().numpy(),
                        W=tr_np, val_mask=va_np, test_mask=te_np, available=available,
                        X_norm=x_np, normalization=np.array(args.normalization),
                        normalization_offsets=offsets, normalization_scales=scales,
                        cycle_indices=np.arange(args.cycles), ranks=np.array(args.ranks))
    print('\nBest validation step:', best_step)
    if args.skip_test_evaluation:
        print('Held-out entry-test scores skipped for this validation-only ablation.')
    else:
        print(f'Test RMSE (normalized): {test_rmse:.6f}; train-mean baseline: {baseline_rmse:.6f}')
    if not args.skip_test_evaluation:
        print('Beats baseline:', summary['beats_baseline'])
    for metric in feature_metrics:
        print('Feature metric:', metric)
    print('Saved:', out, flush=True)
    print('This is entry completion within the fitting prefix; future SOH prediction is not evaluated.')
    return out


if __name__ == '__main__':
    main()
