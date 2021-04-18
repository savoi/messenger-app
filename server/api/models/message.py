import datetime

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
