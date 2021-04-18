import datetime

from flask_mongoengine import DoesNotExist, MongoEngine
from mongoengine import NotUniqueError, ValidationError

from api import database as db

from api.models.conversation import Conversation
from api.models.message import Message
from api.models.user import User

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
            body = message_body
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

# Returns the conversation with only the latest message between users
def get_all_user_conversation_previews(user_id):
    return Conversation.objects.fields(users=user_id, slice__messages=[-1,1])

# Return full conversation between users
def get_conversation(conversation_id):
    return Conversation.objects.get(id=conversation_id)

# Return a list of users matching a search string
def search_users(search_text):
    return User.objects.search_text(search_text).order_by('$text_score').only('username', 'email')
