import json
from flask import jsonify
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
        total_emissions += float(amount) * food_factor
    return total_emissions

def calculate_retail_emissions(data):
    total_emissions = 0
    for item, quantity in data.items():
        retail_factor = EMISSION_FACTORS["retail"].get(item, {}).get("emission_factor", 0)
        total_emissions += float(quantity) * retail_factor
    return total_emissions

def calculate_transportation_emissions(data):
    total_emissions = 0
    for vehicle, details in data.items():
        if vehicle == "car":
            # We are expecting "vehicle_type" within each car
            vehicle_type = details["vehicle_type"]
            emission_factor = EMISSION_FACTORS["transportation"]["car"].get(vehicle_type, {}).get("emission_factor", 0)
            total_emissions += float(details["distance"]) * emission_factor * float(details["passengers"])
        else:
            # For truck, bus, train, subway, etc.
            emission_factor = EMISSION_FACTORS["transportation"].get(vehicle, {}).get("emission_factor", 0)
            total_emissions += float(details["distance"]) * emission_factor * float(details["passengers"])
    return total_emissions

def calculate_electricity_emissions(data):
    energy_source = data["energy_source"]
    emission_factor = EMISSION_FACTORS["electricity"].get(energy_source, {}).get("emission_factor", 0)
    return float(data["consumption_kwh"]) * emission_factor

def calculate_waste_emissions(data):
    total_emissions = 0
    for waste_type, amount in data.items():
        waste_factor = EMISSION_FACTORS["waste"].get(waste_type, {}).get("emission_factor", 0)
        total_emissions += float(amount) * waste_factor
    return total_emissions

def save_to_database(data, food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, total_emissions, profile_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Step 1: Insert into total_emissions first to get the ID
    cursor.execute("""
        INSERT INTO total_emissions (food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, total_emissions, profile_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    """, (food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, total_emissions, profile_id))

    total_emission_id = cursor.lastrowid  # Fetch the generated ID

    # Step 2: Insert into food_emissions with total_emission_id
    cursor.execute("""
        INSERT INTO food_emissions (beef, chicken, vegetables, total_emission_id)
        VALUES (%s, %s, %s, %s);
    """, (data['food']['beef'], data['food']['chicken'], data['food']['vegetables'], total_emission_id))

    # Step 3: Insert into retail_emissions with total_emission_id
    cursor.execute("""
        INSERT INTO retail_emissions (electronics, clothing, total_emission_id)
        VALUES (%s, %s, %s);
    """, (data['retail']['electronics'], data['retail']['clothing'], total_emission_id))

    # Step 4: Insert into transportation_emissions with total_emission_id
    cursor.execute("""
        INSERT INTO transportation_emissions (vehicle_type, distance, passengers, total_emission_id)
        VALUES (%s, %s, %s, %s);
    """, ("car", data['transportation']['car']['distance'], data['transportation']['car']['passengers'], total_emission_id))

    # Step 5: Insert into electricity_emissions with total_emission_id
    cursor.execute("""
        INSERT INTO electricity_emissions (consumption_kwh, energy_source, total_emission_id)
        VALUES (%s, %s, %s);
    """, (data['electricity']['consumption_kwh'], data['electricity']['energy_source'], total_emission_id))

    # Step 6: Insert into waste_emissions with total_emission_id
    cursor.execute("""
        INSERT INTO waste_emissions (food_waste, paper, plastic, metal, total_emission_id)
        VALUES (%s, %s, %s, %s, %s);
    """, (data['waste']['food_waste'], data['waste']['paper'], data['waste']['plastic'], data['waste']['metal'], total_emission_id))

    # Commit changes
    conn.commit()
    cursor.close()
    conn.close()

    return total_emission_id

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
    cursor.execute("SELECT * FROM total_emissions WHERE profile_id = %s", (id,))
    rows = cursor.fetchall()
    result = []
    for row in rows:
        result.append({
            "total_emissions": row[6],  # Total emissions from the 7th column (index 6)
            "create_ts": row[8],         # Timestamp from the 8th column (index 7)
            "emissions_by_category": {
                "food": row[1],           # Food emissions from the 2nd column (index 1)
                "retail": row[2],         # Retail emissions from the 3rd column (index 2)
                "transportation": row[3], # Transportation emissions from the 4th column (index 3)
                "electricity": row[4],    # Electricity emissions from the 5th column (index 4)
                "waste": row[5]           # Waste emissions from the 6th column (index 5)
            }
        })
    cursor.close()
    conn.close()
    return jsonify(result)    

def addNewUser(username, email, hashed_password):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (fullname, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
    conn.commit()
    cursor.close()
    conn.close()
    
def getPasswordByEmail(email):
    conn = get_db_connection()
    if conn is not None:
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM users WHERE email = %s", (email,))
        password_hash = cursor.fetchone()
        cursor.close()
        conn.close()
        if password_hash is None:
            print(f"No user found with email: {email}")
            return None  # Return None or handle this case accordingly

        # Ensure that password_hash is a tuple and then access the first element
        password = password_hash[0] if password_hash else None
        if password is None:
            print(f"Password for email {email} not found.")
            return None
        return password
    return None

def getIdByEmail(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    id = cursor.fetchone()
    if not id:
        cursor.close()
        conn.close()
        return {"error": "Invalid profile_id, user does not exist."}, 400  # Avoid inserting invalid user_id
    cursor.close()
    conn.close()
    return id[0]