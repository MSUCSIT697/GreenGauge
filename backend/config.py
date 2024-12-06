import os

class Config:
    MYSQL_HOST = os.getenv("DATABASE_HOST")
    MYSQL_USER = 'admin'
    MYSQL_PASSWORD = os.getenv("DATABASE_PWD")
    MYSQL_DB = 'emissions_db'
