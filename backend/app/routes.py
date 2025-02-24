from flask import Blueprint, request, jsonify
from app.services import calculate_food_emissions, calculate_retail_emissions, calculate_transportation_emissions, calculate_electricity_emissions, calculate_waste_emissions, get_total_emissions_by_id, save_to_database

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
    save_to_database(data, total_emissions, food_emissions, retail_emissions, transportation_emissions, electricity_emissions, waste_emissions)

    # Return the response
    return jsonify({"total_emissions": total_emissions, "emissions_by_category": {
        "food": food_emissions,
        "retail": retail_emissions,
        "transportation": transportation_emissions,
        "electricity": electricity_emissions,
        "waste": waste_emissions
    }})

@api_routes.route('/get_total_emissions/<int:id>', methods=['GET'])
def get_total_emissions(id):
    return get_total_emissions_by_id(id) 

