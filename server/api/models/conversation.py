import datetime

from flask_mongoengine import DoesNotExist

from api import database as db


class Message(db.EmbeddedDocument):
    conversation_id = db.ObjectIdField(
        required = True
    )
    from_user = db.ObjectIdField(
        required = True
    )
    body = db.StringField(
        required = True
    )
    created_at = db.DateTimeField(
        default = datetime.datetime.utcnow,
        required = True
    )

    @staticmethod
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


class Conversation(db.Document):
    meta = {'collection': "conversations"}
    users = db.ListField(db.ObjectIdField(),
        required = True
    )
    messages = db.SortedListField(db.EmbeddedDocumentField(Message),
        ordering = 'created_at'
    )

    # Returns the conversation with only the latest message between users
    @staticmethod
    def get_all_user_conversation_previews(user_id):
        return Conversation.objects.fields(users=user_id, slice__messages=[-1,1])

    # Return full conversation between users
    @staticmethod
    def get_conversation(conversation_id, user_id):
        return Conversation.objects.get(id=conversation_id, users__in=[user_id])

    @staticmethod
    def get_conversation_id(user_ids=[]):
        try:
            conversation = Conversation.objects.get(users__all=user_ids)
            return conversation.id
        except DoesNotExist as dne:
            return None
