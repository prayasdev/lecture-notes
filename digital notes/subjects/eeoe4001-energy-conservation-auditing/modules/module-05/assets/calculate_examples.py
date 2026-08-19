import math

# Depreciation example
cost = 1_000_000.0
salvage = 100_000.0
life = 5
straight_line = (cost - salvage) / life
rate = 2 / life
book = cost
ddb = []
for year in range(1, life + 1):
    dep = min(book * rate, book - salvage)
    ddb.append(dep)
    book -= dep

# Time value of money and annuity
P = 100_000.0
i = 0.08
n = 5
fv = P * (1 + i) ** n
pv_future = fv / (1 + i) ** n
annual = 80_000.0
annuity_factor = (1 - (1 + i) ** (-n)) / i
pv_annuity = annual * annuity_factor

# NPV example: initial cost; annual net cash flow; residual value
initial = 240_000.0
annual_net = 70_000.0
residual = 20_000.0
npv = -initial + sum(annual_net / (1 + i) ** t for t in range(1, n + 1)) + residual / (1 + i) ** n

# IRR by bisection for [-240k, 70k,70k,70k,70k,90k]
cashflows = [-240_000.0, 70_000.0, 70_000.0, 70_000.0, 70_000.0, 90_000.0]
def npv_at(rate):
    return sum(cf / (1 + rate) ** t for t, cf in enumerate(cashflows))
lo, hi = -0.99, 2.0
for _ in range(200):
    mid = (lo + hi) / 2
    if npv_at(lo) * npv_at(mid) <= 0:
        hi = mid
    else:
        lo = mid
irr = (lo + hi) / 2

# Motor replacement example
shaft_kw = 30.0
old_eta = 0.88
new_eta = 0.93
hours = 4_000
price = 10.0
investment_motor = 120_000.0
motor_kwh_saving = (shaft_kw / old_eta - shaft_kw / new_eta) * hours
motor_cost_saving = motor_kwh_saving * price
motor_payback = investment_motor / motor_cost_saving

# PF correction example
apparent_before = 500.0 / 0.70
apparent_after = 500.0 / 0.95
kva_reduction = apparent_before - apparent_after
demand_rate = 180.0
annual_demand_saving = kva_reduction * demand_rate * 12
pf_investment = 250_000.0
pf_payback = pf_investment / annual_demand_saving

# Lighting retrofit example
lighting_investment = 200_000.0
lighting_kwh_saving = 30_000.0
energy_price = 9.0
maintenance_saving = 20_000.0
lighting_annual_saving = lighting_kwh_saving * energy_price + maintenance_saving
lighting_payback = lighting_investment / lighting_annual_saving

print(f"Depreciation: straight-line annual={straight_line:.0f}; DDB={','.join(f'{x:.0f}' for x in ddb)}")
print(f"TVM: FV={fv:.0f}; PV of future amount={pv_future:.0f}; annuity PV={pv_annuity:.0f}")
print(f"NPV example={npv:.0f}; IRR={irr*100:.2f}%")
print(f"Motor: kWh saving={motor_kwh_saving:.0f}; annual saving={motor_cost_saving:.0f}; payback={motor_payback:.2f} years")
print(f"PF: kVA reduction={kva_reduction:.1f}; annual demand saving={annual_demand_saving:.0f}; payback={pf_payback:.2f} years")
print(f"Lighting: annual saving={lighting_annual_saving:.0f}; payback={lighting_payback:.2f} years")
