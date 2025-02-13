from flask import Flask
from .routes import api_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')  # Load configuration from config.py
    app.register_blueprint(api_routes)      # Register the API routes
    return app
