import sys
import os

# Set the correct Python path
sys.path.insert(0, "/var/www/backend")
sys.path.insert(0, "/var/www/backend/app")  # Ensure the app directory is included

# Activate virtual environment
venv_path = "/var/www/backend/venv"
os.environ["VIRTUAL_ENV"] = venv_path
os.environ["PATH"] = f"{venv_path}/bin:{os.environ['PATH']}"
sys.path.insert(0, f"{venv_path}/lib/python3.8/site-packages")  # Adjust if necessary

# Import the Flask app
from app import create_app
application = create_app()