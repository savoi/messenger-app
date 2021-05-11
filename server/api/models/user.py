from flask_mongoengine import DoesNotExist
from mongoengine import NotUniqueError, ValidationError

from api import database as db


class User(db.Document):
    meta = {
        'collection': "users",
        'indexes': [
            {
                'fields': ["$username", "$email"]
            }
        ]
    }
    username = db.StringField(
        required=True,
        unique=True,
        min_length=2,
        max_length=50
    )
    email = db.EmailField(
        required=True,
        unique=True
    )
    password = db.StringField(
        required=True
    )
    profile_photo = db.ImageField(
        size=(800, 800, True)
    )

    @staticmethod
    def add(username, email, hashedpw):
        try:
            new_user = User(
                username=username,
                email=email,
                password=hashedpw
            )
            new_user.save()
            return {'status': "success", 'message': "User successfully added."}
        except NotUniqueError as nue:
            unique_violation = ""
            for field in User._fields:
                if field in str(nue):
                    unique_violation = 'That {} already exists.'.format(field)
                    break
            return {'status': "error", 'message': unique_violation}
        except ValidationError as ve:
            return {
                'status': "error",
                'message': str(ve)
            }
        except Exception as e:
            return {'status': "error", 'message': str(e)}

    @staticmethod
    def get(email):
        try:
            return User.objects.get(email=email)
        except DoesNotExist:
            return None

    @staticmethod
    def get_from_username(username):
        try:
            return User.objects.get(username=username)
        except DoesNotExist:
            return None

    # Return a list of users matching a search string
    @staticmethod
    def search(search_text):
        return User.objects(
            username__contains=search_text
        ).order_by(
            'username'
        ).only(
            'username', 'email'
        )
