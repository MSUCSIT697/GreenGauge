import json
from app.database import get_db_connection

# Load emission factors from JSON file
def load_emission_factors():
    with open('/var/www/backend/emission_factors.json', 'r') as f:
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

def save_to_database(data, food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, total_emissions):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO food_emissions (beef, chicken, vegetables)
        VALUES (%s, %s, %s);
    """, (data['food']['beef'], data['food']['chicken'], data['food']['vegetables']))

    cursor.execute("""
        INSERT INTO retail_emissions (electronics, clothing)
        VALUES (%s, %s);
    """, (data['retail']['electronics'], data['retail']['clothing']))

    cursor.execute("""
        INSERT INTO transportation_emissions (vehicle_type, distance, passengers)
        VALUES (%s, %s, %s);
    """, ("car", data['transportation']['car']['distance'], data['transportation']['car']['passengers']))

    cursor.execute("""
        INSERT INTO electricity_emissions (consumption_kwh, energy_source)
        VALUES (%s, %s);
    """, (data['electricity']['consumption_kwh'], data['electricity']['energy_source']))

    cursor.execute("""
        INSERT INTO waste_emissions (food_waste, paper, plastic, metal)
        VALUES (%s, %s, %s, %s);
    """, (data['waste']['food_waste'], data['waste']['paper'], data['waste']['plastic'], data['waste']['metal']))

    cursor.execute("""
        INSERT INTO total_emissions (food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, total_emissions)
        VALUES (%s, %s, %s, %s, %s, %s);
    """, (food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, total_emissions))

    conn.commit()
    cursor.close()
    conn.close()

def get_food_emissions_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM food_emissions WHERE id = %s", (id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return json.dumps(rows)

def get_retail_emissions_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM retail_emissions WHERE id = %s", (id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return json.dumps(rows)

def get_transportation_emissions_by_id(id):        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transportation_emissions WHERE id = %s", (id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return json.dumps(rows)

def get_electricity_emissions_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM electricity_emissions WHERE id = %s", (id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return json.dumps(rows)

def get_waste_emissions_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM waste_emissions WHERE id = %s", (id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return json.dumps(rows)

def get_total_emissions_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM total_emissions WHERE id = %s", (id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return json.dumps(rows)