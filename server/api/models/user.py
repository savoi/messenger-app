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
        required = True,
        unique = True,
        min_length = 2,
        max_length = 50
    )
    email = db.EmailField(
        required = True,
        unique = True
    )
    password = db.StringField(
        required = True
    )
    profile_photo = db.ImageField(
        size = (800, 800, True)
    )
