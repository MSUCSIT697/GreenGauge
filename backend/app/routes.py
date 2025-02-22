from flask import Blueprint, request, jsonify
from app.services import calculate_food_emissions, calculate_retail_emissions, calculate_transportation_emissions, calculate_electricity_emissions, calculate_waste_emissions
from app.database import get_db_connection

api_routes = Blueprint('api_routes', __name__)

# Health check endpoint
@api_routes.route('/health', methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


@api_routes.route('/calculate_emissions', methods=['POST'])
def calculate_emissions():
    data = request.get_json()

    # Calculate emissions
    food_emissions = calculate_food_emissions(data['food'])
    retail_emissions = calculate_retail_emissions(data['retail'])
    transportation_emissions = calculate_transportation_emissions(data['transportation'])
    electricity_emissions = calculate_electricity_emissions(data['electricity'])
    waste_emissions = calculate_waste_emissions(data['waste'])

    # Total emissions
    total_emissions = food_emissions + retail_emissions + transportation_emissions + electricity_emissions + waste_emissions

    # Save to database
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

    # Return the response
    return jsonify({"total_emissions": total_emissions, "emissions_by_category": {
        "food": food_emissions,
        "retail": retail_emissions,
        "transportation": transportation_emissions,
        "electricity": electricity_emissions,
        "waste": waste_emissions
    }})

