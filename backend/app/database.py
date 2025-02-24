import mysql.connector
from flask import current_app

# Function to get a database connection
def get_db_connection():
    try:
        return mysql.connector.connect(
            host=current_app.config["MYSQL_HOST"],
            user=current_app.config["MYSQL_USER"],
            password=current_app.config["MYSQL_PASSWORD"], 
            database=current_app.config["MYSQL_EMISSIONS_DB"],
            port=int(current_app.config["MYSQL_PORT"])
        )
    except mysql.connector.Error as err:
        print(f"Database Connection Error: {err}")
        return None
