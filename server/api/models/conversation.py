import datetime

from flask_mongoengine import DoesNotExist

from api import database as db

SUCCESS_ADD_MESSAGE = {
    'status': "success",
    'message': "Message added successfully."
}
ERROR_ADD_MESSAGE = {
    'status': "error",
    'message': "Error adding message to database."
}


class Message(db.EmbeddedDocument):
    conversation_id = db.ObjectIdField(
        required=True
    )
    from_user = db.StringField(
        required=True
    )
    body = db.StringField(
        required=True
    )
    created_at = db.DateTimeField(
        default=datetime.datetime.utcnow,
        required=True
    )

    @staticmethod
    def add(from_username, to_username, conversation_id, message_body):
        try:
            message = Message(
                from_user=from_username,
                body=message_body
            )
            # Need to create new conversation
            if not conversation_id:
                conversation = Conversation(
                    users=[from_username, to_username],
                    messages=[]
                )
                conversation.save()
                message.conversation_id = conversation.id
            # Conversation exists
            else:
                message.conversation_id = conversation_id
                conversation = Conversation.objects.get(
                    id=conversation_id,
                    users__all=[from_username, to_username]
                )
            # Push message and save conversation
            conversation.update(push__messages=message)
            conversation.save()
            return SUCCESS_ADD_MESSAGE
        except Exception:
            return ERROR_ADD_MESSAGE


class Conversation(db.Document):
    meta = {'collection': "conversations"}
    users = db.ListField(
        db.StringField(),
        required=True
    )
    messages = db.SortedListField(
        db.EmbeddedDocumentField(Message),
        ordering='created_at'
    )

    # Returns the conversation with only the latest message between users
    @staticmethod
    def get_previews(username):
        return Conversation.objects(
            users__in=[username]
        ).fields(
            slice__messages=[-1, 1]
        )

    # Return full conversation
    @staticmethod
    def get(conversation_id):
        return Conversation.objects.get(id=conversation_id)

    @staticmethod
    def get_id(usernames=[]):
        try:
            conversation = Conversation.objects.get(users__all=usernames)
            return conversation.id
        except DoesNotExist:
            return None
