from flask import Blueprint, request, jsonify
from app.services import (
    addNewUser,
    calculate_food_emissions,
    calculate_guest_emissions,
    calculate_retail_emissions,
    calculate_transportation_emissions,
    calculate_electricity_emissions,
    calculate_waste_emissions,
    get_total_emissions_by_id,
    getIdByEmail,
    getPasswordByEmail,
    save_to_database,
    getUserNameByEmail,
    update_email,
    update_password,
    update_username
)
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import bcrypt
from flask import current_app
import jwt
from jwt.exceptions import InvalidTokenError
from app.database import get_db_connection
from datetime import datetime
from flask import Flask, request, render_template, jsonify
from categorization.pdf_processor import process_pdf
from flask_cors import CORS
from datetime import timedelta

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
    current_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

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
    if len(data['food']) > 0:
        food_emissions = calculate_food_emissions(data['food'])
    else:
        food_emissions = 0
    if len(data['retail']) > 0:
        retail_emissions = calculate_retail_emissions(data['retail'])
    else:
        retail_emissions = 0
    if len(data['transportation']) > 0:
        transportation_emissions = calculate_transportation_emissions(data['transportation'])
    else:
        transportation_emissions = 0
    if len(data['electricity']) > 0:
        electricity_emissions = calculate_electricity_emissions(data['electricity'])
    else:
        electricity_emissions = 0
    if len(data['waste']) > 0:
        waste_emissions = calculate_waste_emissions(data['waste'])
    else:
        waste_emissions = 0

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
                "total_emissions": total_emissions,  # Total emissions (from column 0)
                "create_ts": current_timestamp, 
                "emissions": [
                    {"category": "Electricity", "value": electricity_emissions},  # Electricity emissions (column 4)
                    {"category": "Transportation", "value": transportation_emissions},  # Transportation emissions (column 3)
                    {"category": "Waste", "value": waste_emissions},  # Waste emissions (column 5)
                    {"category": "Food", "value": food_emissions},  # Food emissions (column 1)
                    {"category": "Retail", "value": retail_emissions}  # Retail emissions (column 2)
                ]
            })

# ✅ Get total emissions for Guest Users
@api_routes.route('/guest_emissions', methods=['POST'])
def guest_emissions():
    data = request.get_json()

    print("🚨 Debug: Received data for guest emissions calculation:", data)

    current_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    emissions = calculate_guest_emissions(data)
    print("🚨 Debug: Calculated emissions for guest user:", emissions)

    total_emissions = sum(emissions.values())
    print("🚨 Debug: Calculated total emissions for guest user:", total_emissions)
    return jsonify({
                "total_emissions": total_emissions,  # Total emissions (from column 0)
                "create_ts": current_timestamp, 
                "emissions": [
                    {"category": "Electricity", "value": emissions.get('electricity', 0)},
                    {"category": "Transportation", "value": emissions.get('car', 0)},
                    {"category": "Water", "value": emissions.get('water', 0)},
                    {"category": "Food", "value": emissions.get('food', 0)},
                    {"category": "Flight Travel", "value": emissions.get('flight_travel', 0)}
        ]
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
        # Set token expiration to 2 days (48 hours)
        expires = timedelta(days=2)
        access_token = create_access_token(identity=email, expires_delta=expires)
        user_name = getUserNameByEmail(email)
        return jsonify({
            'message': 'Login successful', 
            'token': access_token, 
            'profile': {
                'username': user_name, 
                'email': email
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

@api_routes.route('/update_profile', methods=['Post'])
@jwt_required()
def profile():
    data = request.json
    current_user = get_jwt_identity()
    user_id = getIdByEmail(current_user)
    if not user_id:
        return jsonify({'error': 'User not found'}), 404
    if 'username' in data:
        username = data.get('username')
        update_username(username, user_id)
    if 'email' in data:
        email = data.get('email')
        update_email(email, user_id)
    if 'password' in data:
        password = data.get('password')
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        update_password(hashed_password, user_id)
    return jsonify({'message': 'Profile updated successfully'}), 200



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
    
    try:
        file = request.files['pdf']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file and file.filename.endswith('.pdf'):
            result = process_pdf(file)
            if 'error' in result:
                return jsonify({"error": result['error']}), 500
            return jsonify({
                "status": "success",
                "data": result,
            }), 200

        return jsonify({"error": "Invalid file type. Only PDFs are allowed."}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500