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

api_routes = Blueprint('api_routes', __name__)

# Function to check for JWT token
def verify_token():
    auth_header = request.headers.get('Authorization')
    
    if auth_header is None:
        return None  # No Authorization header found, treat as guest user

    try:
        # Extract and decode the JWT token
        token = auth_header.split()[1]  # Token comes after "Bearer "
        decoded_token = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        return decoded_token
    except Exception as e:
        return None


# ✅ Health check endpoint
@api_routes.route('/health', methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200

# ✅ Calculate Emissions
@api_routes.route('/calculate_emissions', methods=['POST'])
def calculate_emissions():
    data = request.get_json()
    # current_user = get_jwt_identity()  # Gets logged-in user ID or None

    token = verify_token()
    if token:
        current_user = token['sub']
    else:
        current_user = None

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

    # Save to database if user is logged in
    # if current_user:
        # profile_id = getIdByEmail(current_user)
        # total_emissions_id = save_to_database(
        #     data,
        #     total_emissions,
        #     food_emissions,
        #     retail_emissions,
        #     transportation_emissions,
        #     electricity_emissions,
        #     waste_emissions,
        #     profile_id
        # )
    if(current_user):
        profile_id = getIdByEmail(current_user)
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
    
    # Return the response
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
    username = data.get('username')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        addNewUser(username, email, hashed_password)
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as err:
        return jsonify({'error : Failed to create user :: ': str(err)}), 500

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
    
# # ✅ Protected route example
@api_routes.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Hello, {current_user}! This is a protected route.'}), 200
