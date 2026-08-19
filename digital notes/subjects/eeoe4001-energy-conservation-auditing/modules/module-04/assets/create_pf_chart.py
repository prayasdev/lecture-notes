import matplotlib.pyplot as plt
import numpy as np

P = 500.0
V = 415.0
pf = np.array([0.70, 0.80, 0.90, 0.95, 0.98, 1.00])
kva = P / pf
current = P * 1000 / (np.sqrt(3) * V * pf)

plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})
fig, ax1 = plt.subplots(figsize=(9.6, 5.0), dpi=180)
ax1.plot(pf, kva, marker="o", linewidth=2.3, color="#1f6f8b", label="Apparent power (kVA)")
ax1.set_xlabel("Power factor")
ax1.set_ylabel("Apparent power (kVA)")
ax1.set_xlim(0.68, 1.01)
ax1.set_ylim(480, 750)
ax1.grid(axis="y", color="#d9e2ec", linewidth=0.8)
ax1.spines["top"].set_visible(False)

ax2 = ax1.twinx()
ax2.plot(pf, current, marker="s", linestyle="--", linewidth=2.0, color="#b45f06", label="Line current at 415 V")
ax2.set_ylabel("Line current (A)")
ax2.set_ylim(650, 1050)
ax2.spines["top"].set_visible(False)

l1, lab1 = ax1.get_legend_handles_labels()
l2, lab2 = ax2.get_legend_handles_labels()
ax1.legend(l1 + l2, lab1 + lab2, frameon=False, loc="upper right")
ax1.set_title("Effect of power-factor improvement at constant active power", fontsize=14, fontweight="bold", color="#17365d", pad=12)
fig.text(0.5, 0.01, "Illustrative example: P = 500 kW, V = 415 V, balanced three-phase system; actual tariffs and losses require site measurements.", ha="center", fontsize=8.5, color="#5b6770")
fig.tight_layout(rect=[0, 0.04, 1, 1])
fig.savefig("/home/ubuntu/module4_notes/assets/illustrative_pf_improvement.png", bbox_inches="tight", facecolor="white")
