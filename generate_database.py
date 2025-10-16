import json
import random
import numpy as np

def generate_performance_curve(max_flow, max_head):
    """Gera uma curva de desempenho (H/Q) parabolicamente decrescente."""
    curve = []
    # Cria uma curva que começa em max_head e termina perto de zero em max_flow
    x = np.linspace(0, max_flow, 10)
    y = max_head * (1 - (x / max_flow)**2 * (random.uniform(0.8, 1.2)))
    y = np.clip(y, 0, max_head) # Garante que a altura não seja negativa

    for i in range(len(x)):
        curve.append({"x": round(x[i], 2), "y": round(y[i], 2)})
    return curve

def generate_power_curve(max_flow, max_power):
    """Gera uma curva de potência (P/Q) realisticamente crescente."""
    curve = []
    # Cria uma curva de potência que aumenta com o caudal
    x = np.linspace(0, max_flow, 10)
    y = max_power * (0.1 + 0.9 * (x / max_flow)**random.uniform(1.2, 1.8))

    for i in range(len(x)):
        curve.append({"x": round(x[i], 2), "y": round(y[i], 3)})
    return curve

def generate_pumps():
    """Gera uma lista de bombas com dados simulados."""
    brands = ["Grundfos", "Wilo", "KSB", "LOWARA", "DAB", "Speroni"]
    pump_types = {
        "Small Circulator": {"max_flow_range": (2, 6), "max_head_range": (4, 8), "connection": "roscada", "dn": [25, 32]},
        "Medium Circulator": {"max_flow_range": (5, 20), "max_head_range": (8, 15), "connection": "flangeada", "dn": [32, 40, 50]},
        "Large Circulator": {"max_flow_range": (20, 60), "max_head_range": (15, 30), "connection": "flangeada", "dn": [50, 65, 80]},
        "High Head Circulator": {"max_flow_range": (10, 40), "max_head_range": (30, 50), "connection": "flangeada", "dn": [40, 50, 65]},
        "Very Large Circulator": {"max_flow_range": (60, 100), "max_head_range": (10, 25), "connection": "flangeada", "dn": [80, 100, 125]}
    }

    pumps = []
    for brand in brands:
        for i in range(20):
            pump_type_name = random.choice(list(pump_types.keys()))
            pump_type = pump_types[pump_type_name]

            max_flow = round(random.uniform(*pump_type["max_flow_range"]), 1)
            max_head = round(random.uniform(*pump_type["max_head_range"]), 1)

            # Estimar potência com base no caudal e altura
            # P(kW) ~= (Q(m3/h) * H(m)) / (367 * eff)
            # Assumindo uma eficiência média de 0.5 para simplificar
            max_power = (max_flow * max_head) / (367 * 0.5) * random.uniform(1.1, 1.5) # Adiciona variação
            max_power = round(max_power, 2)

            has_variation = random.choice([True, True, False]) # 2/3 de probabilidade de ter variação

            pump = {
                "brand": brand,
                "model": f"{brand.split(' ')[0]}-{pump_type_name.split(' ')[0]}-{int(max_head*10)}-{int(max_flow*10)}-{i+1}",
                "energyClass": random.choices(["A", "B", "C"], weights=[5, 3, 2], k=1)[0],
                "voltage": "400V" if max_power > 1.5 else "230V",
                "powerFactor": round(random.uniform(0.85, 0.95), 2),
                "systemType": random.sample(["aquecimento", "arrefecimento", "condensacao"], k=random.randint(1,3)),
                "fluidCompatibility": ["agua", "agua_glicol"],
                "maxTemp": random.randint(95, 140),
                "minTemp": random.randint(-25, 0),
                "maxFlow": max_flow,
                "maxHead": max_head,
                "hasVariation": has_variation,
                "controlType": ["pressao", "temperatura"] if has_variation else ["none"],
                "material": random.choice(["ferro_fundido", "aco_inoxidavel", "bronze"]),
                "connectionType": pump_type["connection"],
                "connectionDN": random.choice(pump_type["dn"]),
                "estimatedPrice": round(max_power * 800 + max_head * 50 + random.uniform(-100, 100)),
                "curveData": generate_performance_curve(max_flow, max_head),
                "powerCurveData": generate_power_curve(max_flow, max_power)
            }
            pumps.append(pump)

    return pumps

if __name__ == "__main__":
    generated_pumps = generate_pumps()
    with open('database.json', 'w', encoding='utf-8') as f:
        json.dump(generated_pumps, f, ensure_ascii=False, indent=4)

    print(f"Base de dados gerada com sucesso com {len(generated_pumps)} bombas.")
    print("Ficheiro 'database.json' criado/atualizado.")