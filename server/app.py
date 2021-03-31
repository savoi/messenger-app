import configparser
import os

from flask import Flask
from flask_login import LoginManager
from flask_mongoengine import MongoEngine
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.auth import auth
from db.db import initialize_db, User

config = configparser.ConfigParser()
config.read(os.path.abspath(os.path.join(".env")))

app = Flask(__name__)
app.config.update(
    MONGODB_DB = str(config['MONGO_DB']['DB']),
    MONGODB_HOST = str(config['MONGO_DB']['HOST']),
    MONGODB_PORT = int(config['MONGO_DB']['PORT']),
    SECRET_KEY = config['FLASK_OPTIONS']['SECRET_KEY'],
    SESSION_COOKIE_HTTPONLY = True,
    REMEMBER_COOKIE_HTTPONLY = True,
    SESSION_COOKIE_SAMESITE = "Strict"
)
initialize_db(app)

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.objects.get(email=user_id)

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(auth)
