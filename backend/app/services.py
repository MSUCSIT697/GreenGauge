import json
from flask import jsonify
from app.database import get_db_connection

# Load emission factors from JSON file
def load_emission_factors():
    with open('/var/www/backend/emission_factors.json', 'r') as f:
        return json.load(f)

# Load the emission factors once when the application starts
EMISSION_FACTORS = load_emission_factors()

# Load emission factors from JSON file
def load_guest_emission_factors():
    with open('/var/www/backend/guest_emission_factors.json', 'r') as f:
        return json.load(f)

# Load the emission factors once when the application starts
GUEST_EMISSION_FACTORS = load_guest_emission_factors()


def convert_to_zero(value):
    return 0 if not value else value

def calculate_guest_emissions(data):
    # Initialize total carbon emissions
    emissions = {
        "food": 0,
        "flight_travel": 0,
        "car": 0,
        "water": 0,
        "electricity": 0
    }
    
    # Calculate Food Emissions
    if data['food']['omnivore'] == 'yes':
        emissions['food'] += GUEST_EMISSION_FACTORS['food']['omnivore']['emission_factor'] * 30
    if data['food']['vegetarian'] == 'yes':
        emissions['food'] += GUEST_EMISSION_FACTORS['food']['vegetarian']['emission_factor'] * 30
    if data['food']['vegan'] == 'yes':
        emissions['food'] += GUEST_EMISSION_FACTORS['food']['vegan']['emission_factor'] * 30
    
    # Calculate Food Emissions
    for diet_type, value in data['food'].items():
        if value == 'yes':
            emissions['food'] += GUEST_EMISSION_FACTORS['food'][diet_type]['emission_factor'] * 30
    
    # Calculate Flight Travel Emissions
    for travel_type, value in data['flight_travel'].items():
        if value == 'yes':
            emissions['flight_travel'] += (GUEST_EMISSION_FACTORS['flight_travel'][travel_type]['emission_factor'] * 
                                           GUEST_EMISSION_FACTORS['flight_travel'][travel_type]['frequency'] * 100)
    
    # Calculate Car Emissions
    if 'miles' in data['car'] and data['car']['miles']:
        emissions['car'] += float(convert_to_zero(data['car']['miles'])) * GUEST_EMISSION_FACTORS['car']['miles']['emission_factor']
    if 'gas' in data['car'] and data['car']['gas']:
        emissions['car'] += float(convert_to_zero(data['car']['gas'])) * GUEST_EMISSION_FACTORS['car']['gas']['emission_factor']
    
    # Calculate Water Emissions
    for water_type, value in data['water'].items():
        if value:
            emissions['water'] += float(convert_to_zero(value)) * GUEST_EMISSION_FACTORS['water'][water_type]['emission_factor']
    
    # Calculate Electricity Emissions
    for electricity_type, value in data['electricity'].items():
        if value:
            emissions['electricity'] += float(convert_to_zero(value)) * GUEST_EMISSION_FACTORS['electricity'][electricity_type]['emission_factor']

    return emissions

# Emission Calculation Functions
def calculate_food_emissions(data):
    # Loop through the food data, calculate emissions based on the emission_factor
    total_emissions = 0
    diet = data["diet"]
    food_factor = EMISSION_FACTORS["food"].get(diet, {}).get("emission_factor", 0)
    # multiply by 30 to get monthly emissions
    total_emissions = food_factor * 30 
    return total_emissions
    
def calculate_retail_emissions(data):
    total_emissions = 0
    for item, quantity in data.items():
        retail_factor = EMISSION_FACTORS["retail"].get(item, {}).get("emission_factor", 0)
        total_emissions += float(convert_to_zero(quantity)) * retail_factor
    return total_emissions

def calculate_transportation_emissions(data):
    total_emissions = 0
    for vehicle, details in data.items():
        if vehicle == "car":
            # We are expecting "vehicle_type" within each car
            vehicle_type = details["vehicle_type"]
            emission_factor = EMISSION_FACTORS["transportation"]["car"].get(vehicle_type, {}).get("emission_factor", 0)
            total_emissions += float(convert_to_zero(details["distance"])) * emission_factor 
            # * float(convert_to_zero(details["passengers"]))
        else:
            # For bus, train, subway, etc.
            emission_factor = EMISSION_FACTORS["transportation"].get(vehicle, {}).get("emission_factor", 0)
            total_emissions += float(convert_to_zero((details["cost"]))) * emission_factor 
            # * float(convert_to_zero(details["passengers"]))
    return total_emissions

def calculate_electricity_emissions(data):
    total_emissions = 0
    energy_source = data["energy_source"]
    emission_factor = EMISSION_FACTORS["electricity"].get(energy_source, {}).get("emission_factor", 0)
    total_emissions = float(convert_to_zero(data["consumption"])) * emission_factor
    return total_emissions

def calculate_waste_emissions(data):
    total_emissions = 0
    for waste_type, amount in data.items():
        waste_factor = EMISSION_FACTORS["waste"].get(waste_type, {}).get("emission_factor", 0)
        total_emissions += float(convert_to_zero(amount)) * waste_factor
    return total_emissions * 4  # Multiply by 4 to get monthly emissions

def save_to_database(data, total_emissions, food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, profile_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Step 1: Insert into total_emissions first to get the ID
    cursor.execute("""
        INSERT INTO total_emissions (food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, total_emissions, profile_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    """, (food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions, total_emissions, profile_id))

    total_emission_id = cursor.lastrowid  # Fetch the generated ID

# Do not require storing individual data in separate tables

    # # Step 2: Insert into food_emissions with total_emission_id
    # cursor.execute("""
    #     INSERT INTO food_emissions (beef, chicken, vegetables, total_emission_id)
    #     VALUES (%s, %s, %s, %s);
    # """, (data['food']['beef'], data['food']['chicken'], data['food']['vegetables'], total_emission_id))

    # # Step 3: Insert into retail_emissions with total_emission_id
    # cursor.execute("""
    #     INSERT INTO retail_emissions (electronics, clothing, total_emission_id)
    #     VALUES (%s, %s, %s);
    # """, (data['retail']['electronics'], data['retail']['clothing'], total_emission_id))

    # # Step 4: Insert into transportation_emissions with total_emission_id
    # cursor.execute("""
    #     INSERT INTO transportation_emissions (vehicle_type, distance, passengers, total_emission_id)
    #     VALUES (%s, %s, %s, %s);
    # """, ("car", data['transportation']['car']['distance'], data['transportation']['car']['passengers'], total_emission_id))

    # # Step 5: Insert into electricity_emissions with total_emission_id
    # cursor.execute("""
    #     INSERT INTO electricity_emissions (consumption, energy_source, total_emission_id)
    #     VALUES (%s, %s, %s);
    # """, (data['electricity']['consumptionh'], data['electricity']['energy_source'], total_emission_id))

    # # Step 6: Insert into waste_emissions with total_emission_id
    # cursor.execute("""
    #     INSERT INTO waste_emissions (food_waste, paper, plastic, metal, total_emission_id)
    #     VALUES (%s, %s, %s, %s, %s);
    # """, (data['waste']['food_waste'], data['waste']['paper'], data['waste']['plastic'], data['waste']['metal'], total_emission_id))

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
        result.append(
            {
                "total_emissions": row[6],  # Total emissions (from column 0)
                "create_ts": row[8], 
                "emissions": [
                    {"category": "Electricity", "value": row[4]},  # Electricity emissions (column 4)
                    {"category": "Transportation", "value": row[3]},  # Transportation emissions (column 3)
                    {"category": "Waste", "value": row[5]},  # Waste emissions (column 5)
                    {"category": "Food", "value": row[1]},  # Food emissions (column 1)
                    {"category": "Retail", "value": row[2]}  # Retail emissions (column 2)
                ]
            })
    cursor.close()
    conn.close()
    return result   

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

def getUserNameByEmail(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT fullname FROM users WHERE email = %s", (email,))
    name = cursor.fetchone()
    cursor.close()
    conn.close()
    return name[0]

def update_username(username, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET fullname = %s WHERE id = %s", (username, user_id))
    conn.commit()
    cursor.close()
    conn.close()

def update_email(email, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET email = %s WHERE id = %s", (email, user_id))
    conn.commit()
    cursor.close()
    conn.close()

def update_password(password, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET password = %s WHERE id = %s", (password, user_id))
    conn.commit()
    cursor.close()
    conn.close()
