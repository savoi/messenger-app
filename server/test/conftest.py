import pytest
from datetime import timedelta
from api import create_app
from api.db import User
from flask_jwt_extended import create_access_token, get_csrf_token, JWTManager
from mongoengine import connect, disconnect

@pytest.fixture
def app():
    app = create_app({
        'TESTING': True,
        'JWT_ACCESS_TOKEN_EXPIRES': timedelta(hours=1),
        'JWT_COOKIE_SECURE': False,
        'JWT_SECRET_KEY': "test_key",
        'JWT_TOKEN_LOCATION': ["cookies"],
        'MONGODB_CONNECT': False
    })

    with app.app_context():
        disconnect()
        db = connect('test', host='mongomock://localhost')
        test_user1 = User(username='bill', email='bill@mail.com', password='password')
        test_user1.save()
        test_user2 = User(username='test_user', email='test_user@mail.com', password='password')
        test_user2.save()
        jwt = JWTManager()
        jwt.init_app(app)

        @jwt.user_lookup_loader
        def user_lookup_callback(_jwt_header, jwt_data):
            identity = jwt_data["sub"]
            return User.objects.get(email=identity)

    yield app

    # fixture cleanup
    db.drop_database('test')
    disconnect()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def tokens(app, client):
    # Expose a CSRF access token to be used on protected routes
    with app.app_context():
        access_token = create_access_token(identity="test_user@mail.com")
        csrf_token = get_csrf_token(access_token)
    return access_token, csrf_token
