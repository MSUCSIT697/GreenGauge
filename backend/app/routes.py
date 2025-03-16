from flask import Blueprint, request, jsonify
from app.services import (
    addNewUser,
    calculate_food_emissions,
    calculate_retail_emissions,
    calculate_transportation_emissions,
    calculate_electricity_emissions,
    calculate_waste_emissions,
    get_total_emissions_by_id,
    getIdByEmail,
    getPasswordByEmail,
    save_to_database
)
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import bcrypt
from flask import current_app
import jwt
from jwt.exceptions import InvalidTokenError
from app.database import get_db_connection

from flask import Flask, request, render_template, jsonify
from categorization.pdf_processor import process_pdf
from flask_cors import CORS

api_routes = Blueprint('api_routes', __name__)

# ✅ Function to verify JWT Token
def verify_token():
    auth_header = request.headers.get('Authorization')
    
    if auth_header is None:
        return None  # No Authorization header found, treat as guest user

    try:
        token = auth_header.split()[1]  # Token comes after "Bearer "
        decoded_token = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        return decoded_token
    except Exception as e:
        return None


# ✅ Health Check
@api_routes.route('/health', methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


# ✅ Calculate Emissions
@api_routes.route('/calculate_emissions', methods=['POST'])
def calculate_emissions():
    data = request.get_json()

    # ✅ Step 1: Verify JWT Token
    token = verify_token()
    if token:
        current_user = token['sub']
        profile_id = getIdByEmail(current_user)
        
        if not profile_id:
            print("🚨 ERROR: Could not retrieve profile ID for user:", current_user)
            return jsonify({"error": "Invalid user"}), 401  # Return error if profile ID not found
    else:
        profile_id = None  # Allow guest users to calculate emissions without storing

    # ✅ Step 2: Calculate emissions
    food_emissions = calculate_food_emissions(data['food'])
    retail_emissions = calculate_retail_emissions(data['retail'])
    transportation_emissions = calculate_transportation_emissions(data['transportation'])
    electricity_emissions = calculate_electricity_emissions(data['electricity'])
    waste_emissions = calculate_waste_emissions(data['waste'])

    total_emissions = sum([
        food_emissions,
        retail_emissions,
        transportation_emissions,
        electricity_emissions,
        waste_emissions
    ])

    # ✅ Step 3: Save results to the database (ONLY IF USER IS LOGGED IN)
    if profile_id:
        total_emissions_id = save_to_database(
            data,
            total_emissions,
            food_emissions,
            retail_emissions,
            transportation_emissions,
            electricity_emissions,
            waste_emissions,
            profile_id
        )

        print(f"✅ Successfully stored results for user {current_user} with record ID {total_emissions_id}")

    # ✅ Step 4: Return JSON response
    return jsonify({
        "total_emissions": total_emissions,
        "emissions_by_category": {
            "food": food_emissions,
            "retail": retail_emissions,
            "transportation": transportation_emissions,
            "electricity": electricity_emissions,
            "waste": waste_emissions
        }
    })


# ✅ Get total emissions by ID (Protected Route)
@api_routes.route('/get_total_emissions/<int:user_id>', methods=['GET'])
@jwt_required()
def get_total_emissions(user_id):
    return get_total_emissions_by_id(user_id)



# ✅ User Signup
@api_routes.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        addNewUser(username, email, hashed_password)
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as err:
        return jsonify({'error': f'Failed to create user: {str(err)}'}), 500


# ✅ User Login
@api_routes.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    storedPassword = getPasswordByEmail(email)

    if not storedPassword:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if bcrypt.checkpw(password.encode('utf-8'), storedPassword.encode('utf-8')):
        access_token = create_access_token(identity=email)
        return jsonify({'message': 'Login successful', 'token': access_token}), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401


# ✅ Protected route (Example)
@api_routes.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Hello, {current_user}! This is a protected route.'}), 200


# ✅ Fetch past user results
@api_routes.route('/get_user_results', methods=['GET'])
@jwt_required()
def get_user_results():
    """Retrieve all saved emissions results for the logged-in user."""
    current_user = get_jwt_identity()

    if not current_user:
        return jsonify({'error': 'User not authenticated'}), 401

    user_id = getIdByEmail(current_user)
    if not user_id:
        print(f"🚨 Debug: getIdByEmail({current_user}) returned {user_id}")
        return jsonify({'error': 'User not found'}), 404

    # Fetch all stored results for this user
    results = get_total_emissions_by_id(user_id)

    return jsonify({'results': results}), 200

@api_routes.route('/upload', methods=['POST'])
def handle_upload():
    if 'pdf' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['pdf']
    try:
        result = process_pdf(file.stream)
        return jsonify({
            "status": "success",
            "data": result['transactions'],
            "totals": result['totals'],
            "footprint": result['footprint'],
            "dates": result['dates']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
