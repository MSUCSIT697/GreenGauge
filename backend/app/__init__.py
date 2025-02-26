from flask import Flask, jsonify
from .routes import api_routes
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.database import get_db_connection

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object('config.Config')  # Load configuration from config.py
    app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'  
 # ✅ Initialize JWT Manager
    jwt = JWTManager(app)
    app.register_blueprint(api_routes)      # Register the API routes
    return app
