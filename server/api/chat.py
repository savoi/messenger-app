from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required

from api.models.conversation import Message
from api.models.conversation import Conversation
from api.models.user import User

add_message = Message.add_message
get_conversation_previews = Conversation.get_all_user_conversation_previews
get_conversation = Conversation.get_conversation
get_conversation_id = Conversation.get_conversation_id
get_user_from_username = User.get_user_from_username
search_users = User.search_users

chat = Blueprint('chat', __name__)

ERROR_RECIPIENT_DOES_NOT_EXIST = {
    'status': "error",
    'message': "The message recipient user does not exist."
}
ERROR_GET_CONVERSATION_PREVIEWS = {
    'status': "error",
    'message': "Could not retrieve conversation previews."
}
ERROR_EMPTY_SEARCH_STRING = {
    'status': "error",
    'message': "A search string is required."
}
ERROR_CANT_GET_USERS = {
    'status': "error",
    'message': "Could not retrieve users."
}


@chat.route('/messages', methods=['POST'])
@jwt_required()
def messages():
    try:
        post_data = request.get_json()
        to_username = post_data['to_username']
        message_body = post_data['body']
    except Exception as e:
        return jsonify({'status': "error", 'message': repr(e)}), 400

    to_user = get_user_from_username(to_username)
    if not to_user:
        return jsonify(ERROR_RECIPIENT_DOES_NOT_EXIST), 400

    conversation_id = get_conversation_id([current_user.id, to_user.id])
    db_response = add_message(
        current_user.id, to_user.id, conversation_id, message_body
    )
    if db_response['status'] == "success":
        return jsonify(db_response), 201
    else:
        return jsonify(db_response), 500


@chat.route('/conversations', methods=['GET'])
@chat.route('/conversations/<string:conversation_id>', methods=['GET'])
@jwt_required()
def conversations(conversation_id=None):
    try:
        if not conversation_id:
            conversation_previews = get_conversation_previews(current_user.id)
            return jsonify(conversation_previews), 200
        else:
            conversation = get_conversation(conversation_id, current_user.id)
            return jsonify(conversation), 200
    except Exception:
        return jsonify(ERROR_GET_CONVERSATION_PREVIEWS), 500


@chat.route('/users', methods=['GET'])
@jwt_required()
def users():
    try:
        search_text = request.args.get('search')
        if search_text:
            users = search_users(search_text)
            return jsonify(users), 200
        else:
            return jsonify(ERROR_EMPTY_SEARCH_STRING), 400
    except Exception:
        return jsonify(ERROR_CANT_GET_USERS), 500
