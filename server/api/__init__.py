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

database = MongoEngine()
jwt = JWTManager()


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    # ensure the instance folder exists
    try:
        if not os.path.exists(app.instance_path):
            os.makedirs(app.instance_path)
        if test_config is None:
            app.config.from_pyfile('config.py', silent=False)
        else:
            app.config.from_mapping(test_config)
    except FileNotFoundError:
        app.logger.error(
            "Ensure config.py is in the instance directory before running."
        )
        return None

    database.init_app(app)
    jwt.init_app(app)

    from api.auth import auth
    from api.chat import chat
    from api.models.user import User

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

    return app
