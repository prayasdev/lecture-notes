import matplotlib.pyplot as plt
import numpy as np

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
baseline = np.array([100, 102, 99, 104, 106, 110, 112, 109, 105, 103, 101, 100])
current = np.array([98, 99, 97, 100, 101, 104, 105, 103, 100, 98, 97, 96])

plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})
fig, ax = plt.subplots(figsize=(10.5, 4.8), dpi=180)
ax.plot(months, baseline, marker="o", linewidth=2.2, color="#8c8c8c", label="Baseline EnPI")
ax.plot(months, current, marker="o", linewidth=2.4, color="#1f6f8b", label="Current EnPI")
ax.fill_between(range(len(months)), current, baseline, where=current <= baseline, color="#9bd3c7", alpha=0.35, label="Illustrative improvement gap")
ax.set_title("Illustrative monitoring view: monthly energy-performance indicator", fontsize=14, fontweight="bold", color="#17365d", pad=12)
ax.set_ylabel("Indexed energy performance (base month = 100)")
ax.set_xlabel("Reporting month")
ax.set_ylim(90, 118)
ax.grid(axis="y", color="#d9e2ec", linewidth=0.8)
ax.spines[["top", "right"]].set_visible(False)
ax.legend(loc="upper left", frameon=False, ncol=3)
ax.text(0.5, -0.22, "Illustrative teaching example; values are not measured plant data. Investigate deviations before attributing improvement to a project.", transform=ax.transAxes, ha="center", fontsize=8.5, color="#5b6770")
fig.tight_layout()
fig.savefig("/home/ubuntu/module2_notes/assets/illustrative_monitoring_dashboard.png", bbox_inches="tight", facecolor="white")
