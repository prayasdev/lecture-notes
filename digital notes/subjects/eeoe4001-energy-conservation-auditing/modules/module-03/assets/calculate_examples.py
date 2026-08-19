import math

# Transformer example
S_kVA = 500
load = 0.60
pf = 0.90
P0 = 1.5
Pcu_fl = 5.0
Pcu = Pcu_fl * load**2
Pout = S_kVA * load * pf
eta_transformer = Pout / (Pout + P0 + Pcu) * 100

# Motor example
V = 415
I = 50
pf_motor = 0.84
P_in = math.sqrt(3) * V * I * pf_motor / 1000
P_out = 27.5
eta_motor = P_out / P_in * 100
load_fraction = P_out / 37.0 * 100

# Motor replacement example
shaft_output = 30.0
eta_old = 0.88
eta_new = 0.93
hours = 4000
old_input = shaft_output / eta_old
new_input = shaft_output / eta_new
power_saving = old_input - new_input
annual_kwh_saving = power_saving * hours

# Power factor correction
P_kw = 500
pf1 = 0.75
pf2 = 0.95
kvar_required = P_kw * (math.tan(math.acos(pf1)) - math.tan(math.acos(pf2)))

print(f"Transformer: Pcu={Pcu:.2f} kW, Pout={Pout:.1f} kW, efficiency={eta_transformer:.2f}%")
print(f"Motor: input={P_in:.2f} kW, efficiency={eta_motor:.2f}%, output-load={load_fraction:.1f}%")
print(f"Motor replacement: old input={old_input:.2f} kW, new input={new_input:.2f} kW, saving={power_saving:.2f} kW, annual={annual_kwh_saving:.0f} kWh")
print(f"PF correction: required capacitor rating={kvar_required:.1f} kVAr")
