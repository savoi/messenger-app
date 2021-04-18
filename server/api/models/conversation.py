from api import database as db
from api.models.message import Message

class Conversation(db.Document):
    meta = {'collection': "conversations"}
    users = db.ListField(db.ObjectIdField(),
        required = True
    )
    messages = db.SortedListField(db.EmbeddedDocumentField(Message),
        ordering = 'created_at'
    )
