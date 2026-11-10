# Trilha instrumental original sintetizada (120 BPM, 35 s), sincronizada com as cenas.
import numpy as np, wave

SR = 44100
DUR = 35.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
BEAT = 0.5; BAR = 2.0

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

def add(sig, t0, gain=1.0, pan=0.0):
    i0 = int(t0 * SR)
    if i0 >= N: return
    sig = sig[: N - i0]
    gl = gain * np.sqrt((1 - pan) / 2) * 1.414
    gr = gain * np.sqrt((1 + pan) / 2) * 1.414
    L[i0:i0 + len(sig)] += sig * gl
    R[i0:i0 + len(sig)] += sig * gr

def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x); s = 0.0
    # vectorised-ish via lfilter-equivalent loop in chunks
    for i in range(len(x)):
        s = (1 - a) * x[i] + a * s
        y[i] = s
    return y

def lp_fft(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(X, len(x))

def hp_fft(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    with np.errstate(divide='ignore'):
        H = 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order))
    X *= H
    return np.fft.irfft(X, len(x))

def env_adsr(n, a, d, s, r):
    t = np.arange(n) / SR
    total = n / SR
    e = np.ones(n) * s
    e[t < a] = t[t < a] / a
    m = (t >= a) & (t < a + d)
    e[m] = 1 - (1 - s) * (t[m] - a) / d
    rel = t > total - r
    e[rel] *= (total - t[rel]) / r
    return e

# ---------- instruments ----------
def pad(notes, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for m in notes:
        for det in (-0.12, 0.0, 0.11):
            f = midi(m + det)
            ph = rng.random() * 2 * np.pi
            # soft saw from few harmonics
            for k in range(1, 7):
                s += np.sin(2 * np.pi * f * k * t + ph * k) / (k ** 1.3)
    s = lp_fft(s, 1800)
    s *= env_adsr(n, 0.6, 0.5, 0.85, 0.7)
    return s / (len(notes) * 9)

def pluck(m, dur=1.2, bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = midi(m); s = np.zeros(n)
    for k, a in enumerate([1, .55, .3, .18, .1, .06], 1):
        s += a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * (3.0 + k * 1.6 / bright))
    s *= np.minimum(1, t / 0.004)
    return s * 0.5

def bell(m, dur=2.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = midi(m)
    s = (np.sin(2*np.pi*f*t) * np.exp(-t*2.2) + 0.45*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*4)
         + 0.25*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*7) + 0.15*np.sin(2*np.pi*f*4*t)*np.exp(-t*3))
    s *= np.minimum(1, t / 0.002)
    return s * 0.35

def bass(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f = midi(m)
    s = np.sin(2*np.pi*f*t) + 0.3*np.sin(2*np.pi*2*f*t) + 0.12*np.sin(2*np.pi*3*f*t)
    s *= env_adsr(n, 0.008, 0.15, 0.7, 0.05)
    return s * 0.45

def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 7.5)
    s += 0.25 * rng.standard_normal(n) * np.exp(-t * 300)
    return np.tanh(s * 1.6) * 0.8

def clap():
    n = int(0.35 * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    e = np.exp(-t * 18) + 0.6*np.exp(-((t-0.012)*SR/60)**2) + 0.5*np.exp(-((t-0.024)*SR/60)**2)
    s = hp_fft(lp_fft(nz * e, 5000), 900)
    return s * 0.45

def hat(open_=False):
    n = int((0.25 if open_ else 0.07) * SR); t = np.arange(n) / SR
    s = hp_fft(rng.standard_normal(n), 7000) * np.exp(-t * (14 if open_ else 60))
    return s * 0.18

def snare_hit():
    n = int(0.2 * SR); t = np.arange(n) / SR
    s = hp_fft(rng.standard_normal(n), 1500) * np.exp(-t * 22) + 0.4*np.sin(2*np.pi*190*t)*np.exp(-t*30)
    return s * 0.35

def crash(dur=3.0):
    n = int(dur * SR); t = np.arange(n) / SR
    s = hp_fft(rng.standard_normal(n), 4000) * np.exp(-t * 1.6)
    return s * 0.28

def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = t / dur
    nz = rng.standard_normal(n)
    # sweeping band: crossfade a low-passed and high-passed noise
    lo = lp_fft(nz, 900); hi = hp_fft(nz, 3500)
    s = lo * (1 - x) + hi * x
    f = 200 + 1400 * x ** 2
    s += 0.3 * np.sin(2 * np.pi * np.cumsum(f) / SR)
    return s * x ** 2.2 * 0.35

def impact():
    n = int(2.5 * SR); t = np.arange(n) / SR
    f = 30 + 70 * np.exp(-t * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    s += lp_fft(rng.standard_normal(n), 400) * np.exp(-t * 5) * 0.6
    return np.tanh(s * 1.4) * 0.8

def swoosh(dur=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = t / dur
    s = lp_fft(rng.standard_normal(n), 2500) * np.sin(np.pi * x) ** 2
    return s * 0.25

# ---------- arrangement ----------
# I - V - vi - IV in C (C, G, Am, F); voicings
CH = [
    dict(root=36, pad=[60, 64, 67, 71], arp=[60, 64, 67, 72, 76, 72, 67, 64]),
    dict(root=43, pad=[59, 62, 67, 74], arp=[59, 62, 67, 71, 74, 71, 67, 62]),
    dict(root=45, pad=[60, 64, 69, 72], arp=[57, 60, 64, 69, 72, 69, 64, 60]),
    dict(root=41, pad=[60, 65, 69, 72], arp=[57, 60, 65, 69, 72, 69, 65, 60]),
]
MEL = [76, 74, 72, 79, 79, 77, 76, 72]  # bell motif (one note per beat pair)

nbars = int(np.ceil(DUR / BAR))
for b in range(nbars):
    t0 = b * BAR
    c = CH[b % 4]
    # pad: everywhere except final ring (handled after)
    if t0 < 32:
        g = 0.55 if t0 < 6 else 0.5
        if t0 == 0: g = 0.45
        add(pad(c['pad'], BAR + 0.7), t0, g, -0.2)
        add(pad([n + 12 for n in c['pad'][:2]], BAR + 0.7), t0, 0.18, 0.3)
    # piano arpeggio: 6s onwards
    if 6 <= t0 < 32:
        step = 0.25
        for i in range(8):
            m = c['arp'][i]
            tt = t0 + i * step
            add(pluck(m, 1.0, 1.0), tt, 0.32 if t0 < 14 else 0.26, 0.35 if i % 2 else -0.35)
        if t0 >= 14 and not (20 <= t0 < 20.1):
            # extra 16th sparkle an octave up in full section
            for i in range(8):
                add(pluck(c['arp'][i] + 12, 0.6, 1.5), t0 + i*0.25 + 0.125, 0.09, 0.5 if i%2 else -0.5)
    # bass
    if 10 <= t0 < 32 and not (12 <= t0 < 14 and False):
        if t0 < 14 or 26 <= t0 < 30:
            add(bass(c['root'], 1.9), t0, 0.7)
        else:
            for i in range(8):
                if 30 <= t0 and i >= 4: break
                add(bass(c['root'] + (12 if i % 2 else 0), 0.24), t0 + i * 0.25, 0.55)
    # bells melody in the full sections
    if (14 <= t0 < 26) or (26 <= t0 < 32):
        for i in range(4):
            m = MEL[(b * 4 + i) % 8]
            # fit to chord: snap to nearest pad tone + octave
            pcs = [(n % 12) for n in c['pad']]
            best = min(range(70, 86), key=lambda x: (0 if x % 12 in pcs else 1, abs(x - m)))
            add(bell(best, 2.0), t0 + i * 0.5 + (0.25 if i == 3 else 0), 0.22 if t0 < 26 else 0.28, 0.2 * (-1) ** i)

# drums
def beats(a, b):
    t = a
    while t < b - 1e-6:
        yield t
        t += BEAT
for tb in beats(10, 13.5):          # soft kicks on downbeats in build-up
    if abs((tb % BAR)) < 1e-6 or abs((tb % BAR) - 1.0) < 1e-6:
        add(kick(), tb, 0.6)
for tb in beats(8, 13.5):
    add(hat(), tb + 0.25, 0.7, 0.3)
for tb in beats(14, 26):            # full groove
    add(kick(), tb, 0.95)
    add(hat(), tb + 0.25, 1.0, 0.3)
    if abs((tb % 1.0) - 0.5) < 1e-6:
        add(clap(), tb, 0.85, -0.05)
for tb in beats(26, 30):            # lighter emotional part
    if abs(tb % BAR) < 1e-6:
        add(kick(), tb, 0.6)
    add(hat(), tb + 0.25, 0.6, 0.3)
# snare roll 30 -> 32
t = 30.0; k = 0
while t < 31.95:
    step = 0.25 if t < 31 else 0.125
    add(snare_hit(), t, 0.25 + 0.5 * (t - 30) / 2, 0.1)
    t += step

# FX
add(bell(84, 3.0), 0.3, 0.16, 0.3)       # logo reveal
add(swoosh(1.2), 0.7, 0.8)
add(riser(1.2), 0.8, 0.8)
add(impact(), 2.0, 0.6)                  # confetti + GRANDE ALEGRIA
add(crash(2.5), 2.0, 0.7)
add(bell(88, 2.0), 2.45, 0.18, -0.3)
add(swoosh(1.0), 5.5, 0.9)               # transition 1
add(riser(2.0), 12.0, 1.0)               # build to the invitation
add(crash(3.5), 14.0, 1.0)
add(impact(), 14.0, 0.7)
add(bell(88, 2.5), 16.8, 0.18, -0.3)     # CONFRATERNIZAÇÃO reveal
add(swoosh(0.9), 19.6, 0.9)              # transition 3
add(swoosh(0.9), 26.1, 0.8)              # transition 4
for tt, m in [(21.2, 84), (22.4, 86), (23.4, 88)]:
    add(bell(m, 1.5), tt, 0.12, 0.4)
add(riser(2.0), 30.0, 0.8)
add(crash(4.0), 32.0, 1.0)
add(impact(), 32.0, 0.8)
# final big chord ringing out
add(pad([48, 55, 60, 64, 67, 72, 76], 3.2), 32.0, 0.8)
for i, m in enumerate([60, 64, 67, 72, 76, 79, 84]):
    add(pluck(m, 3.0, 0.6), 32.0 + i * 0.03, 0.25, (-1) ** i * 0.3)
    add(bell(m + 12, 3.0), 32.0 + i * 0.06, 0.08, (-1) ** i * 0.4)
add(bass(36, 3.0), 32.0, 0.7)

# ---------- reverb (convolution with decaying noise IR) ----------
def reverb(x, seconds=2.2, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR); t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-t * 3.0 / seconds * 2.3)
    ir = lp_fft(ir, 6000)
    ir /= np.sqrt(np.sum(ir ** 2))
    m = len(x) + n
    nfft = 1 << int(np.ceil(np.log2(m)))
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return y

wetL = reverb(L, seed=1); wetR = reverb(R, seed=2)
L2 = L + 0.28 * wetL; R2 = R + 0.28 * wetR

# master: fade in/out, soft clip, normalise
t = np.arange(N) / SR
fade = np.minimum(1, t / 0.8) * np.clip((DUR - t) / 1.6, 0, 1)
L2 *= fade; R2 *= fade
peak = max(np.abs(L2).max(), np.abs(R2).max())
L2 = np.tanh(L2 / peak * 1.3) / np.tanh(1.3) * 0.89
R2 = np.tanh(R2 / peak * 1.3) / np.tanh(1.3) * 0.89
out = np.stack([L2, R2], 1)
pcm = (out * 32767).astype(np.int16)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('ok', pcm.shape)
