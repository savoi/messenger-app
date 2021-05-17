import json

from flask import jsonify

from api.models.conversation import Conversation
from api.models.user import User


ERROR_SENDER_DOES_NOT_EXIST = {
    'status': "error",
    'message': "The message sender username does not exist."
}

ERROR_RECIPIENT_DOES_NOT_EXIST = {
    'status': "error",
    'message': "The message recipient username does not exist."
}


def jsonify_bson(bson_object):
    if bson_object is None:
        return {}
    try:
        return jsonify(json.loads(bson_object.to_json()))
    except AttributeError:
        return jsonify(bson_object)


def add_message(conversation_id, from_username, body, created_at):
    from_user = User.get_from_username(from_username)
    if not from_user:
        return jsonify(ERROR_SENDER_DOES_NOT_EXIST), 400

    conversation = Conversation.get(conversation_id)

    db_response = conversation.add_message(
        from_user.username, body, created_at
    )
    if db_response['status'] == "success":
        return jsonify(db_response), 201
    else:
        return jsonify(db_response), 500
