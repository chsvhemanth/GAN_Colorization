import torch
import torch.nn as nn

class DownBlock(nn.Module):
    def __init__(self, in_c, out_c, normalize=True):
        super().__init__()
        layers = [nn.Conv2d(in_c, out_c, 4, 2, 1, bias=not normalize)]
        if normalize: layers.append(nn.BatchNorm2d(out_c))
        layers.append(nn.LeakyReLU(0.2, inplace=True))
        self.model = nn.Sequential(*layers)
    def forward(self, x): return self.model(x)

class UpBlock(nn.Module):
    def __init__(self, in_c, out_c, dropout=False):
        super().__init__()
        layers = [nn.ConvTranspose2d(in_c, out_c, 4, 2, 1, bias=False),
                  nn.BatchNorm2d(out_c)]
        if dropout: layers.append(nn.Dropout(0.5))
        layers.append(nn.ReLU(inplace=True))
        self.model = nn.Sequential(*layers)
    def forward(self, x): return self.model(x)

class GeneratorUNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.d1 = DownBlock(1, 64, normalize=False)
        self.d2 = DownBlock(64, 128)
        self.d3 = DownBlock(128, 256)
        self.d4 = DownBlock(256, 512)
        self.d5 = DownBlock(512, 512)
        self.u1 = UpBlock(512, 512, dropout=True)
        self.u2 = UpBlock(512+512, 256, dropout=True)
        self.u3 = UpBlock(256+256, 128)
        self.u4 = UpBlock(128+128, 64)
        self.final = nn.Sequential(
            nn.ConvTranspose2d(64+64, 3, 4, 2, 1),
            nn.Tanh()
        )
    def forward(self, x):
        d1 = self.d1(x)
        d2 = self.d2(d1)
        d3 = self.d3(d2)
        d4 = self.d4(d3)
        d5 = self.d5(d4)
        u1 = self.u1(d5); u1 = torch.cat([u1, d4], 1)
        u2 = self.u2(u1); u2 = torch.cat([u2, d3], 1)
        u3 = self.u3(u2); u3 = torch.cat([u3, d2], 1)
        u4 = self.u4(u3); u4 = torch.cat([u4, d1], 1)
        return self.final(u4)
