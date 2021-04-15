import datetime

from flask_mongoengine import DoesNotExist, MongoEngine
from mongoengine import NotUniqueError, ValidationError

db = MongoEngine()

class Message(db.EmbeddedDocument):
    meta = {
        'ordering': ["-created_at"]
    }
    conversation_id = db.ObjectIdField()
    from_user = db.ObjectIdField()
    body = db.StringField(
        required = True
    )
    created_at = db.DateTimeField(
        required = True
    )

class Conversation(db.Document):
    meta = {'collection': "conversations"}
    users = db.ListField(db.ObjectIdField(),
        required = True
    )
    messages = db.ListField(db.EmbeddedDocumentField(Message))


class User(db.Document):
    meta = {'collection': "users"}
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

def initialize_db(app):
    db.init_app(app)

# Return a `user` document from the db
def get_user(email):
    try:
        user = User.objects.get(email=email)
    except DoesNotExist as dne:
        user = None
    return user

def get_user_from_username(username):
    try:
        return User.objects.get(username=username)
    except DoesNotExist as dne:
        return None

# Add a new user/credential set to the db
def add_user(username, email, hashedpw):
    try:
        new_user = User(
            username = username,
            email = email,
            password = hashedpw
        ).save()
        return {"success": True}
    except NotUniqueError as nue:
        unique_violation = ""
        for field in User._fields:
            if field in str(nue):
                unique_violation = 'That {} already exists.'.format(field)
                break
        return {'error': {'status': "error", 'message': unique_violation}}
    except ValidationError as ve:
        return {'error': {'validation_error': str(ve)}}
    except Exception as e:
        return {"error": {'error': str(e)}}

# Get a users session
def get_user_session(email):
    try:
        return Session.get(userid=email)
    except Exception as e:
        return {"error": e}

def get_conversation_id(user1_id, user2_id):
    try:
        conversation = Conversation.objects.get(users__all=[user1_id, user2_id])
        return conversation.id
    except DoesNotExist as dne:
        return None

def add_message(user1_id, user2_id, conversation_id, message_body):
    try:
        message = Message(
            from_user = user1_id,
            body = message_body,
            created_at = datetime.datetime.now()
        )
        # Conversation exists
        if conversation_id:
            message.conversation_id = conversation_id
            conversation = Conversation.objects.get(id=conversation_id)
        # Need to create new conversation
        else:
            conversation = Conversation(
                users = [user1_id, user2_id],
                messages = []
            )
            conversation.save()
            message.conversation_id = conversation.id
        # Push message and save conversation
        conversation.update(push__messages=message)
        conversation.save()
        return {'status': "success", 'message': "Message added successfully."}
    except Exception as e:
        return {'status': "error", 'message': "Error adding message to database."}

def get_user_conversation_preview(user):
    return Conversation.objects.get(users__in=user)
