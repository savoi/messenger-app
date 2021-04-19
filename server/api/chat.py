import bcrypt

from is_safe_url import is_safe_url
from flask import (
    abort,
    Blueprint,
    jsonify,
    make_response,
    redirect,
    request,
    session,
    url_for
)
from flask_jwt_extended import (
    create_access_token,
    current_user,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies
)

from api.models.conversation import Message
add_message = Message.add_message

from api.models.conversation import Conversation
get_all_user_conversation_previews = Conversation.get_all_user_conversation_previews
get_conversation = Conversation.get_conversation
get_conversation_id = Conversation.get_conversation_id

from api.models.user import User
get_user_from_username = User.get_user_from_username
search_users = User.search_users

chat = Blueprint('chat', __name__)

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
        return jsonify({'status': "error", 'message': "The message recipient user does not exist."}), 400

    conversation_id = get_conversation_id([current_user.id, to_user.id])
    db_response = add_message(current_user.id, to_user.id, conversation_id, message_body)
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
            conversation_previews = get_all_user_conversation_previews(current_user.id)
            return jsonify(conversation_previews), 200
        else:
            conversation = get_conversation(conversation_id, current_user.id)
            return jsonify(conversation), 200
    except Exception as e:
        response = {'status': "error", 'message': "Could not retrieve conversation previews."}
        return jsonify(response), 500

@chat.route('/users', methods=['POST'])
@jwt_required()
def users():
    try:
        search_text = request.args.get('search', None)
        if search_text:
            users = search_users(search_text)
            return jsonify(users), 200
        else:
            response = {'status': "error", 'message': "A search string is required."}
            return jsonify(response), 400
    except Exception as e:
        response = {'status': "error", 'message': "Could not retrieve users."}
        return jsonify(response), 500
