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

from db.db import add_message, get_conversation_id, get_user_from_username

chat = Blueprint('chat', __name__)

@chat.route('/messages', methods=['POST'])
@jwt_required()
def messages():
    try:
        post_data = request.get_json()
        dest_username = post_data.get('dest_username')
        message_body = post_data.get('body')
    except Exception as e:
        return jsonify({'status': "error", 'message': str(e)}), 400

    dest_user = get_user_from_username(dest_username)
    if not dest_user:
        return jsonify({'status': "error", 'message': "Dest user does not exist."}), 400

    conversation_id = get_conversation_id(current_user.id, dest_user.id)
    db_response = add_message(current_user.id, dest_user.id, conversation_id, message_body)
    if db_response['status'] == "success":
        return jsonify(db_response), 201
    else:
        return jsonify(db_response), 500


@chat.route('/conversations/<user>', methods=['GET'])
@jwt_required()
def conversations():
    try:
        current_user = get_jwt_identity()
        response = {'current_user': current_user}
        return jsonify(response), 200
    except Exception as e:
        response = {'error': {'auth': "Could not fetch user."}}
        return jsonify(response), 500
