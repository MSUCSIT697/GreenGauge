import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="/var/www/backend/.env")

class Config:
    MYSQL_HOST = os.getenv("RDS_HOST")
    MYSQL_USER = os.getenv("RDS_USER")
    MYSQL_PASSWORD = os.getenv("RDS_PASSWORD")
    MYSQL_EMISSIONS_DB = 'emissions_db'
    MYSQL_PORT = os.getenv("RDS_PORT")
