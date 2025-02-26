from flask import Blueprint, request, jsonify
from app.services import (
    calculate_food_emissions,
    calculate_retail_emissions,
    calculate_transportation_emissions,
    calculate_electricity_emissions,
    calculate_waste_emissions,
    get_total_emissions_by_id,
    save_to_database
)
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.database import get_db_connection  # Assuming you refactored DB connection
import bcrypt

api_routes = Blueprint('api_routes', __name__)

# ✅ Health check endpoint
@api_routes.route('/health', methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200

# ✅ Calculate Emissions
@api_routes.route('/calculate_emissions', methods=['POST'])
@jwt_required()
def calculate_emissions():
    data = request.get_json()

    # Calculate emissions
    food_emissions = calculate_food_emissions(data['food'])
    retail_emissions = calculate_retail_emissions(data['retail'])
    transportation_emissions = calculate_transportation_emissions(data['transportation'])
    electricity_emissions = calculate_electricity_emissions(data['electricity'])
    waste_emissions = calculate_waste_emissions(data['waste'])

    # Total emissions
    total_emissions = sum([
        food_emissions,
        retail_emissions,
        transportation_emissions,
        electricity_emissions,
        waste_emissions
    ])

    # Save to database
    total_emissions_id = save_to_database(
        data,
        total_emissions,
        food_emissions,
        retail_emissions,
        transportation_emissions,
        electricity_emissions,
        waste_emissions
    )

    # Return the response
    return jsonify({
        "id": total_emissions_id,
        "total_emissions": total_emissions,
        "emissions_by_category": {
            "food": food_emissions,
            "retail": retail_emissions,
            "transportation": transportation_emissions,
            "electricity": electricity_emissions,
            "waste": waste_emissions
        }
    })

# ✅ Get total emissions by ID
@api_routes.route('/get_total_emissions/<int:id>', methods=['GET'])
@jwt_required()
def get_total_emissions(id):
    return get_total_emissions_by_id(id)

# ✅ User Signup
@api_routes.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        db = get_db_connection()
        if db:
            with db.cursor() as cursor:
                cursor.execute("INSERT INTO users (email, password_hash) VALUES (%s, %s)", (email, hashed_password))
                db.commit()
            db.close()
            return jsonify({'message': 'User created successfully'}), 201
        else:
            return jsonify({'error': 'Database connection failed'}), 500
    except Exception as err:
        return jsonify({'error': str(err)}), 500

# ✅ User Login
@api_routes.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    db = get_db_connection()
    if db:
        with db.cursor() as cursor:
            cursor.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
        db.close()

        if user and bcrypt.checkpw(password.encode('utf-8'), user[0].encode('utf-8')):
            from flask_jwt_extended import create_access_token
            access_token = create_access_token(identity=email)
            return jsonify({'message': 'Login successful', 'token': access_token}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    else:
        return jsonify({'error': 'Database connection failed'}), 500

# ✅ Protected route example
@api_routes.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Hello, {current_user}! This is a protected route.'}), 200
