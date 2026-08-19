import matplotlib.pyplot as plt
import numpy as np

load = np.array([25, 50, 75, 100, 115, 125])
standard_eff = np.array([84.5, 89.5, 91.5, 92.2, 91.8, 91.2])
premium_eff = np.array([87.5, 92.5, 95.0, 96.0, 95.8, 95.3])
pf = np.array([0.62, 0.76, 0.84, 0.88, 0.90, 0.91])

plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})
fig, ax1 = plt.subplots(figsize=(10.2, 5.2), dpi=180)
ax1.plot(load, standard_eff, marker="o", linewidth=2.2, color="#8c8c8c", label="Illustrative standard-efficiency motor")
ax1.plot(load, premium_eff, marker="o", linewidth=2.2, color="#1f6f8b", label="Illustrative premium-efficiency motor")
ax1.set_xlabel("Motor load (% of rated output)")
ax1.set_ylabel("Efficiency (%)")
ax1.set_xlim(20, 130)
ax1.set_ylim(80, 100)
ax1.set_xticks(load)
ax1.grid(axis="y", color="#d9e2ec", linewidth=0.8)
ax1.spines["top"].set_visible(False)

ax2 = ax1.twinx()
ax2.plot(load, pf * 100, marker="s", linestyle="--", linewidth=1.8, color="#b45f06", label="Illustrative power factor")
ax2.set_ylabel("Power factor (%)")
ax2.set_ylim(50, 100)
ax2.spines["top"].set_visible(False)

lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc="lower right", frameon=False)
ax1.set_title("Motor efficiency and power factor versus load", fontsize=14, fontweight="bold", color="#17365d", pad=12)
fig.text(0.5, 0.01, "Illustrative teaching example; actual curves depend on motor design, voltage, temperature, speed, and test method.", ha="center", fontsize=8.5, color="#5b6770")
fig.tight_layout(rect=[0, 0.04, 1, 1])
fig.savefig("/home/ubuntu/module3_notes/assets/illustrative_motor_efficiency_load.png", bbox_inches="tight", facecolor="white")
