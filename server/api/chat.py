import logging

from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required

from api.models.conversation import Message
from api.models.conversation import Conversation
from api.models.user import User
from api.utils import jsonify_bson

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
ERROR_UNAUTHORIZED_ACCESS = {
    'status': "error",
    'message': "Unauthorized access to conversation."
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

    to_user = User.get_from_username(to_username)
    if not to_user:
        return jsonify(ERROR_RECIPIENT_DOES_NOT_EXIST), 400

    conversation_id = Conversation.get_id([
        current_user.username, to_user.username
    ])
    db_response = Message.add(
        current_user.username, to_user.username, conversation_id, message_body
    )
    if db_response['status'] == "success":
        return jsonify(db_response), 201
    else:
        return jsonify(db_response), 500


@chat.route('/conversations', methods=['GET', 'POST'])
@chat.route('/conversations/<string:conversation_id>', methods=['GET'])
@jwt_required()
def conversations(conversation_id=None):
    if request.method == 'POST':
        try:
            post_data = request.get_json()
            usernames = post_data['usernames']
            conversation_id = Conversation.get_id(usernames)
            if conversation_id:
                return jsonify({'conversationId': conversation_id}), 200
            else:
                db_response = Conversation(
                    users=usernames
                ).save()
                return jsonify({'conversationId': str(db_response.id)}), 201
        except Exception as e:
            return jsonify({'status': "error", 'message': repr(e)}), 400
    else:
        try:
            # Retrieve conversation by list of users or create
            users = request.args.get('users')
            if users:
                userlist = users.split(',')
                conversation_id = Conversation.get_id(userlist)
                if conversation_id:
                    return jsonify({'conversationId': str(conversation_id)}), 200
                else:
                    conversation = Conversation(
                        users=userlist
                    ).save()
                    return jsonify_bson({
                        'conversationId': str(conversation.id)
                    }), 201

            # Retrieve conversation previews
            if not conversation_id:
                conversation_previews = Conversation.get_previews(
                    current_user.username
                )
                return jsonify_bson(conversation_previews), 200

            # Retrieve conversation by id
            else:
                conversation = Conversation.get(conversation_id)
                if current_user.username in conversation.users:
                    return jsonify_bson(conversation), 200
                else:
                    return jsonify(ERROR_UNAUTHORIZED_ACCESS), 401
        except Exception as e:
            logging.exception(request, e)
            return jsonify(ERROR_GET_CONVERSATION_PREVIEWS), 500


@chat.route('/users', methods=['GET'])
@jwt_required()
def users():
    try:
        search_text = request.args.get('search')
        if search_text:
            users = User.search(search_text)
            return jsonify_bson(users), 200
        else:
            return jsonify(ERROR_EMPTY_SEARCH_STRING), 400
    except Exception:
        return jsonify(ERROR_CANT_GET_USERS), 500
