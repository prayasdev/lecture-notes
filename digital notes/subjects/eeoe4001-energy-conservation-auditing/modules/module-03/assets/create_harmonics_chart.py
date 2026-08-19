import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2 * np.pi, 1000)
fundamental = np.sin(x)
third = 0.18 * np.sin(3 * x)
fifth = 0.10 * np.sin(5 * x)
seventh = 0.06 * np.sin(7 * x)
composite = fundamental + third + fifth + seventh

orders = np.array([1, 3, 5, 7, 9, 11])
magnitudes = np.array([100, 18, 10, 6, 3, 2])

plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})
fig, axes = plt.subplots(1, 2, figsize=(11, 4.4), dpi=180)
fig.suptitle("Illustrative effect of harmonics on a periodic waveform", fontsize=14, fontweight="bold", color="#17365d")

axes[0].plot(x, fundamental, linewidth=1.7, color="#8c8c8c", label="Fundamental")
axes[0].plot(x, composite, linewidth=2.2, color="#1f6f8b", label="Composite waveform")
axes[0].set_title("Waveform distortion", color="#17365d")
axes[0].set_xlabel("Electrical angle (rad)")
axes[0].set_ylabel("Normalized amplitude")
axes[0].grid(axis="y", color="#d9e2ec", linewidth=0.8)
axes[0].legend(frameon=False)

axes[1].bar(orders, magnitudes, width=0.65, color="#b45f06")
axes[1].set_title("Illustrative harmonic spectrum", color="#17365d")
axes[1].set_xlabel("Harmonic order")
axes[1].set_ylabel("Magnitude (% of fundamental)")
axes[1].set_xticks(orders)
axes[1].grid(axis="y", color="#d9e2ec", linewidth=0.8)

for ax in axes:
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

fig.text(0.5, 0.01, "Illustrative teaching example; actual harmonic spectra depend on the converter, load, system impedance, and operating point.", ha="center", fontsize=8.5, color="#5b6770")
fig.tight_layout(rect=[0, 0.04, 1, 0.94])
fig.savefig("/home/ubuntu/module3_notes/assets/illustrative_harmonics_waveform.png", bbox_inches="tight", facecolor="white")
