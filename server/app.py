import configparser
import os

from datetime import datetime, timedelta, timezone

from flask import Flask
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    JWTManager,
    set_access_cookies
)
from flask_mongoengine import MongoEngine
from api.auth import auth
from api.chat import chat
from db.db import initialize_db, User

config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".env")))

app = Flask(__name__)
app.config.update(
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(config['JWT']['ACCESS_TOKEN_EXPIRES'])),
    JWT_COOKIE_SECURE = config['JWT'].getboolean('COOKIE_SECURE'),
    JWT_SECRET_KEY = str(config['JWT']['SECRET_KEY']),
    JWT_TOKEN_LOCATION = [str(config['JWT']['TOKEN_LOCATION'])],
    MONGODB_DB = str(config['MONGO_DB']['DB']),
    MONGODB_HOST = str(config['MONGO_DB']['HOST']),
    MONGODB_PORT = int(config['MONGO_DB']['PORT'])
)
initialize_db(app)
jwt = JWTManager(app)

app.register_blueprint(auth)
app.register_blueprint(chat)

# Refresh any token that is within 30 minutes of expiring.
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # If JWT is invalid, return original response
        return response

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.objects.get(email=identity)
