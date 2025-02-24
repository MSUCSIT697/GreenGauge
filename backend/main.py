import os
from flask import Flask, request, jsonify
import mysql.connector
import bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure JWT Secret Key
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your-secret-key")
jwt = JWTManager(app)

# Function to create a database connection
def get_db_connection():
    try:
        return mysql.connector.connect(
            host=os.getenv("RDS_HOST", "database-1.c122k88askq1.us-east-1.rds.amazonaws.com"),
            user=os.getenv("RDS_USER", "admin"),
            password=os.getenv("RDS_PASSWORD", ""),  # Ensure it's set in .env
            database=os.getenv("RDS_DATABASE", "backend"),
            port=int(os.getenv("RDS_PORT", 3306))
        )
    except mysql.connector.Error as err:
        print(f"Database Connection Error: {err}")
        return None

# Initialize database and create users table
try:
    db = get_db_connection()
    if db:
        cursor = db.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL
        )
        """)
        db.commit()
        cursor.close()
        db.close()
except mysql.connector.Error as err:
    print(f"Database Error: {err}")

# ✅ Health Check Route
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "running"}), 200

# ✅ Home Route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to Green Gauge API!"}), 200

# ✅ User Signup (Hashes password before storing)
@app.route('/signup', methods=['POST'])
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
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

# ✅ User Login (Generates JWT Token)
@app.route('/login', methods=['POST'])
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
            access_token = create_access_token(identity=email)
            return jsonify({'message': 'Login successful', 'token': access_token}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    else:
        return jsonify({'error': 'Database connection failed'}), 500

# ✅ Protected Route (Requires JWT)
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Hello, {current_user}! This is a protected route.'}), 200

# ✅ Run the Flask App (Production Ready)
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)  # Allow external access
