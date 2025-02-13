import json

# Load emission factors from JSON file
def load_emission_factors():
    with open('emission_factors.json', 'r') as f:
        return json.load(f)

# Load the emission factors once when the application starts
EMISSION_FACTORS = load_emission_factors()

# Emission Calculation Functions
def calculate_food_emissions(data):
    # Loop through the food data, calculate emissions based on the emission_factor
    total_emissions = 0
    for item, amount in data.items():
        food_factor = EMISSION_FACTORS["food"].get(item, {}).get("emission_factor", 0)
        total_emissions += amount * food_factor
    return total_emissions

def calculate_retail_emissions(data):
    total_emissions = 0
    for item, quantity in data.items():
        retail_factor = EMISSION_FACTORS["retail"].get(item, {}).get("emission_factor", 0)
        total_emissions += quantity * retail_factor
    return total_emissions

def calculate_transportation_emissions(data):
    total_emissions = 0
    for vehicle, details in data.items():
        if vehicle == "car":
            # We are expecting "vehicle_type" within each car
            vehicle_type = details["vehicle_type"]
            emission_factor = EMISSION_FACTORS["transportation"]["car"].get(vehicle_type, {}).get("emission_factor", 0)
            total_emissions += details["distance"] * emission_factor * details["passengers"]
        else:
            # For truck, bus, train, subway, etc.
            emission_factor = EMISSION_FACTORS["transportation"].get(vehicle, {}).get("emission_factor", 0)
            total_emissions += details["distance"] * emission_factor * details["passengers"]
    return total_emissions

def calculate_electricity_emissions(data):
    energy_source = data["energy_source"]
    emission_factor = EMISSION_FACTORS["electricity"].get(energy_source, {}).get("emission_factor", 0)
    return data["consumption_kwh"] * emission_factor

def calculate_waste_emissions(data):
    total_emissions = 0
    for waste_type, amount in data.items():
        waste_factor = EMISSION_FACTORS["waste"].get(waste_type, {}).get("emission_factor", 0)
        total_emissions += amount * waste_factor
    return total_emissions

