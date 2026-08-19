import matplotlib.pyplot as plt
import numpy as np

plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})

# Illustrative life-cycle-cost comparison for an efficient motor or lighting project.
labels = ["Existing / baseline", "Efficient alternative"]
initial = np.array([0.0, 120.0])
energy = np.array([680.0, 430.0])
maintenance = np.array([180.0, 130.0])
replacement = np.array([80.0, 40.0])
residual = np.array([0.0, -20.0])

fig, ax = plt.subplots(figsize=(9.8, 5.0), dpi=180)
ax.bar(labels, initial, label="Initial cost", color="#b45f06")
ax.bar(labels, energy, bottom=initial, label="Present value of energy cost", color="#1f6f8b")
ax.bar(labels, maintenance, bottom=initial + energy, label="Present value of maintenance", color="#7f8c8d")
ax.bar(labels, replacement, bottom=initial + energy + maintenance, label="Present value of replacement", color="#8e7cc3")
ax.bar(labels, residual, bottom=initial + energy + maintenance + replacement, label="Residual value credit", color="#38761d")
ax.set_ylabel("Illustrative present value (cost units)")
ax.set_title("Illustrative life-cycle-cost comparison", fontsize=14, fontweight="bold", color="#17365d", pad=12)
ax.grid(axis="y", color="#d9e2ec", linewidth=0.8)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.legend(frameon=False, loc="upper left")
fig.text(0.5, 0.01, "Illustrative values only; actual LCC requires project-specific costs, discounting, escalation, maintenance, replacements, and residual value.", ha="center", fontsize=8.5, color="#5b6770")
fig.tight_layout(rect=[0, 0.04, 1, 1])
fig.savefig("/home/ubuntu/module5_notes/assets/illustrative_lcc_comparison.png", bbox_inches="tight", facecolor="white")
plt.close(fig)

# Sensitivity chart: simple payback as a function of energy price and operating hours.
energy_price = np.array([6, 8, 10, 12, 14])
hours = np.array([2000, 3000, 4000, 5000, 6000])
capital = 100000.0
power_saving_kw = 18.0
payback = np.zeros((len(hours), len(energy_price)))
for i, h in enumerate(hours):
    for j, price in enumerate(energy_price):
        annual_saving = power_saving_kw * h * price
        payback[i, j] = capital / annual_saving

fig, ax = plt.subplots(figsize=(9.8, 5.0), dpi=180)
for i, h in enumerate(hours):
    ax.plot(energy_price, payback[i], marker="o", linewidth=2, label=f"{h:,} h/year")
ax.set_xlabel("Energy price (currency/kWh)")
ax.set_ylabel("Simple payback (years)")
ax.set_title("Sensitivity of simple payback to energy price and operating hours", fontsize=14, fontweight="bold", color="#17365d", pad=12)
ax.grid(axis="both", color="#d9e2ec", linewidth=0.8)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.legend(frameon=False, ncol=2)
fig.text(0.5, 0.01, "Illustrative example: capital cost = 100,000; power saving = 18 kW; demand effects and escalation excluded.", ha="center", fontsize=8.5, color="#5b6770")
fig.tight_layout(rect=[0, 0.04, 1, 1])
fig.savefig("/home/ubuntu/module5_notes/assets/illustrative_payback_sensitivity.png", bbox_inches="tight", facecolor="white")
