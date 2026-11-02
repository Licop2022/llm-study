"""NiN teaching example: smoke checks by default; training is explicitly opt-in.

Sources: https://zh.d2l.ai/chapter_convolutional-modern/nin.html
         https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html
This is a rewritten teaching implementation, not a record of a completed experiment.
"""
import argparse
import torch
from torch import nn


# region block
def nin_block(in_channels, out_channels, kernel_size, stride=1, padding=0,
              pointwise_layers=2):
    layers = [nn.Conv2d(in_channels, out_channels, kernel_size,
                        stride=stride, padding=padding), nn.ReLU()]
    for _ in range(pointwise_layers):
        layers.extend([nn.Conv2d(out_channels, out_channels, kernel_size=1),
                       nn.ReLU()])
    return nn.Sequential(*layers)
# endregion block


# region model
def build_nin(num_classes=10, pointwise_layers=2):
    def block(cin, cout, kernel, stride=1, padding=0):
        return nin_block(cin, cout, kernel, stride, padding, pointwise_layers)
    return nn.Sequential(
        block(1, 96, 11, stride=4), nn.MaxPool2d(3, stride=2),
        block(96, 256, 5, padding=2), nn.MaxPool2d(3, stride=2),
        block(256, 384, 3, padding=1), nn.MaxPool2d(3, stride=2),
        nn.Dropout(0.5), block(384, num_classes, 3, padding=1),
        nn.AdaptiveAvgPool2d(1), nn.Flatten(start_dim=1),
    )
# endregion model


# region smoke
def smoke_check():
    layer = nn.Conv2d(3, 2, 1)
    with torch.no_grad():
        layer.weight.copy_(torch.tensor([[1., 0., -1.], [0., 2., 1.]])
                           .reshape(2, 3, 1, 1))
        layer.bias.copy_(torch.tensor([0., 1.]))
    x = torch.tensor([1., 2., 3.]).reshape(1, 3, 1, 1)
    assert torch.allclose(layer(x).flatten(), torch.tensor([-2., 8.]))
    f = torch.tensor([1., 3., 5., 7.]).reshape(1, 1, 2, 2)
    assert nn.AdaptiveAvgPool2d(1)(f).item() == 4.

    model = build_nin().eval()
    expected = [(1, 96, 54, 54), (1, 96, 26, 26),
                (1, 256, 26, 26), (1, 256, 12, 12),
                (1, 384, 12, 12), (1, 384, 5, 5),
                (1, 384, 5, 5), (1, 10, 5, 5),
                (1, 10, 1, 1), (1, 10)]
    x = torch.zeros(1, 1, 224, 224)
    with torch.no_grad():
        for module, shape in zip(model, expected):
            x = module(x)
            assert tuple(x.shape) == shape, (type(module).__name__, x.shape)
            print(type(module).__name__, tuple(x.shape))
    assert sum(p.numel() for p in model.parameters()) == 1992166
    print('Smoke checks passed; parameters:',
          sum(p.numel() for p in model.parameters()))
# endregion smoke


# region epoch
def run_epoch(model, loader, device, optimizer=None):
    training = optimizer is not None
    model.train(training)
    criterion = nn.CrossEntropyLoss()
    loss_sum, correct, total = 0., 0, 0
    with torch.set_grad_enabled(training):
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            scores = model(images)  # (B, 10), raw scores, no softmax here
            loss = criterion(scores, labels)  # labels: (B,), torch.long
            if training:
                optimizer.zero_grad(set_to_none=True)
                loss.backward()
                optimizer.step()
            count = labels.numel()
            loss_sum += loss.item() * count
            correct += (scores.argmax(dim=1) == labels).sum().item()
            total += count
    return loss_sum / total, correct / total
# endregion epoch


def train_example(args):
    # torchvision is needed only for optional Fashion-MNIST training.
    from torchvision import datasets, transforms
    from torch.utils.data import DataLoader, random_split
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    transform = transforms.Compose([transforms.Resize((224, 224)),
                                    transforms.ToTensor()])
    dataset = datasets.FashionMNIST(args.data_root, train=True,
                                   transform=transform, download=args.download)
    n_val = len(dataset) // 10
    train_set, val_set = random_split(
        dataset, [len(dataset) - n_val, n_val],
        generator=torch.Generator().manual_seed(args.seed))
    train_loader = DataLoader(train_set, batch_size=args.batch_size,
                              shuffle=True, num_workers=0)
    val_loader = DataLoader(val_set, batch_size=args.batch_size, num_workers=0)
    model = build_nin(pointwise_layers=args.pointwise_layers).to(device)
    for module in model.modules():
        if isinstance(module, nn.Conv2d):
            nn.init.xavier_uniform_(module.weight)
            nn.init.zeros_(module.bias)
    optimizer = torch.optim.SGD(model.parameters(), lr=args.lr)
    print('device:', device, 'pointwise layers:', args.pointwise_layers)
    for epoch in range(args.epochs):
        train_loss, train_acc = run_epoch(model, train_loader, device, optimizer)
        val_loss, val_acc = run_epoch(model, val_loader, device)
        print(f'{epoch + 1}: train loss={train_loss:.4f}, acc={train_acc:.4f}; '
              f'val loss={val_loss:.4f}, acc={val_acc:.4f}')
    # Use this final test result for reporting, not for repeated model selection.
    test_set = datasets.FashionMNIST(args.data_root, train=False,
                                    transform=transform, download=args.download)
    test_loader = DataLoader(test_set, batch_size=args.batch_size, num_workers=0)
    test_loss, test_acc = run_epoch(model, test_loader, device)
    print(f'final test loss={test_loss:.4f}, acc={test_acc:.4f}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--train', action='store_true')
    parser.add_argument('--download', action='store_true')
    parser.add_argument('--data-root', default='./data')
    parser.add_argument('--epochs', type=int, default=1)
    parser.add_argument('--batch-size', type=int, default=32)
    parser.add_argument('--lr', type=float, default=0.1)
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--pointwise-layers', type=int, choices=[0, 1, 2], default=2)
    args = parser.parse_args()
    if args.epochs < 1 or args.batch_size < 1 or args.lr <= 0:
        parser.error('epochs, batch-size and lr must be positive')
    torch.manual_seed(args.seed)
    if args.train:
        train_example(args)
    else:
        smoke_check()


if __name__ == '__main__':
    main()
