from flask_mongoengine import DoesNotExist, MongoEngine

db = MongoEngine()

class User(db.Document):
    meta = {"collection": "users"}
    username = db.StringField(
        required = True,
        unique = True,
        min_length = 2,
        max_length = 50
    )
    email = db.EmailField(
        required = True,
        unique_with = 'username'
    )
    password = db.StringField(
        required = True
    )
    authenticated = db.BooleanField()
    profile_photo = db.ImageField(
        size = (800, 800, True)
    )

    # Requisite functions for flask-login
    def is_authenticated(self):
        return self.authenticated
    def is_active(self):
        return True
    def is_anonymous(self):
        return False
    def get_id(self):
        return self.email

class Session(db.Document):
    meta = {"collection": "sessions"}
    userid = db.StringField(
        required = True,
        unique = True
    )
    cookie = db.StringField(
        required = True
    )

def initialize_db(app):
    db.init_app(app)

# Return a `user` document from the db
def get_user(email):
    try:
        user = User.objects.get(email=email)
    except DoesNotExist as dne:
        user = None
    return user

# Add a new user/credential set to the db
def add_user(username, email, hashedpw):
    try:
        new_user = User(
            username = username,
            email = email,
            password = hashedpw
        ).save()
        return {"success": True}
    except Exception as e:
        return {"error": e}

# Get a users session
def get_user_session(email):
    try:
        return Session.get(userid=email)
    except Exception as e:
        return {"error": e}
