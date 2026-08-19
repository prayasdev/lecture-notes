import matplotlib.pyplot as plt

labels = ["Coal", "Electricity", "Natural gas", "Fuel oil"]
use_values = [60, 20, 15, 5]
cost_values = [35, 45, 15, 5]
colors = ["#4c4c4c", "#2f75b5", "#d98c2b", "#6aa84f"]

plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})
fig, axes = plt.subplots(1, 2, figsize=(10.5, 4.4), dpi=180)
fig.suptitle("Illustrative energy accounting: use share versus cost share", fontsize=14, fontweight="bold", color="#17365d")

for ax, values, title in zip(axes, [use_values, cost_values], ["Final energy use share (%)", "Annual energy-cost share (%)"]):
    wedges, texts, autotexts = ax.pie(
        values,
        colors=colors,
        startangle=90,
        counterclock=False,
        autopct=lambda p: f"{p:.0f}%" if p >= 4 else "",
        pctdistance=0.72,
        wedgeprops={"linewidth": 1.0, "edgecolor": "white"},
        textprops={"color": "#1f2933", "fontsize": 9},
    )
    for t in autotexts:
        t.set_fontweight("bold")
    ax.set_title(title, fontsize=11, pad=10, color="#17365d")
    ax.axis("equal")

fig.legend(labels, loc="lower center", ncol=4, frameon=False, bbox_to_anchor=(0.5, 0.045))
fig.text(0.5, 0.005, "Illustrative teaching example; values are not plant measurements.", ha="center", fontsize=8.5, color="#5b6770")
fig.subplots_adjust(top=0.83, bottom=0.21, wspace=0.25)
fig.savefig("/home/ubuntu/module1_notes/assets/illustrative_energy_cost_pies.png", bbox_inches="tight", facecolor="white")
