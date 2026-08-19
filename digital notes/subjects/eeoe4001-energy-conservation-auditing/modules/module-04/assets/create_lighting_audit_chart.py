import matplotlib.pyplot as plt
import numpy as np

zones = ["Open office", "Corridor", "Workshop", "Store", "Outdoor"]
baseline = np.array([42, 16, 58, 14, 24])
proposed = np.array([28, 9, 42, 8, 17])

x = np.arange(len(zones))
width = 0.36
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})
fig, ax = plt.subplots(figsize=(10.2, 5.0), dpi=180)
ax.bar(x - width/2, baseline, width, label="Baseline annual energy", color="#8c8c8c")
ax.bar(x + width/2, proposed, width, label="Improved design and controls", color="#1f6f8b")
ax.set_ylabel("Annual lighting energy (MWh/year)")
ax.set_xticks(x)
ax.set_xticklabels(zones)
ax.set_ylim(0, 70)
ax.grid(axis="y", color="#d9e2ec", linewidth=0.8)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.legend(frameon=False, loc="upper right")
ax.set_title("Illustrative lighting-energy audit by zone", fontsize=14, fontweight="bold", color="#17365d", pad=12)
fig.text(0.5, 0.01, "Illustrative teaching example; final savings require inventory, operating-hour, illuminance, and control measurements.", ha="center", fontsize=8.5, color="#5b6770")
fig.tight_layout(rect=[0, 0.04, 1, 1])
fig.savefig("/home/ubuntu/module4_notes/assets/illustrative_lighting_audit.png", bbox_inches="tight", facecolor="white")
