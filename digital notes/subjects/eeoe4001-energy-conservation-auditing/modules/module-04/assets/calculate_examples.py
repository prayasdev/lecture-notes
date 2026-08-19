import math

# Power-factor correction example
P = 500.0
pf1 = 0.70
pf2 = 0.95
q_c = P * (math.tan(math.acos(pf1)) - math.tan(math.acos(pf2)))

# Apparent power and current at fixed active power
V = 415.0
s_before = P / pf1
s_after = P / pf2
i_before = P * 1000 / (math.sqrt(3) * V * pf1)
i_after = P * 1000 / (math.sqrt(3) * V * pf2)

# Harmonic distortion example
I1 = 100.0
harmonics = [18.0, 10.0, 6.0]
thd = math.sqrt(sum(i*i for i in harmonics)) / I1 * 100

# Lighting audit example
fixtures = 120
fixture_kw = 0.08
hours = 3200
baseline = fixtures * fixture_kw * hours
savings = baseline * 0.20

print(f"PF correction: {q_c:.1f} kVAr")
print(f"PF improvement: S before={s_before:.1f} kVA, S after={s_after:.1f} kVA")
print(f"PF improvement: I before={i_before:.1f} A, I after={i_after:.1f} A")
print(f"Harmonics: THD_I={thd:.1f}%")
print(f"Lighting: baseline={baseline:.0f} kWh/year, saving={savings:.0f} kWh/year")
