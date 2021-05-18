import datetime

from flask import Blueprint, request
from flask_jwt_extended import decode_token
from flask_socketio import emit, join_room, leave_room

from api import socketio
from api.utils import add_message

events = Blueprint('events', __name__)

users = {}


@socketio.on('connect')
def connect():
    # Verify JWT tokens on connection
    cookie_dict = {}
    cookies = request.environ.get('HTTP_COOKIE')
    if cookies:
        cookies = cookies.split('; ')
        for cookie in cookies:
            parts = cookie.split('=')
            cookie_dict[parts[0]] = parts[1]
        decoded_token = decode_token(
            cookie_dict['access_token_cookie'],
            csrf_value=cookie_dict['csrf_access_token']
        )
        if decoded_token['sub'] != request.args.get('user'):
            return False

    # Add user to dict of online users
    username = request.args.get('user')
    users[username] = {
        'sid': request.sid
    }

    # Add user to room for each chat they are involved in
    rooms = request.args.get('rooms')
    if rooms:
        rooms = rooms.split(',')
    for room in rooms:
        join_room(room)
    handle_status_update()


@socketio.on('disconnect')
def disconnect():
    room = request.args.get('roomId')
    users.pop(request.args.get('user'), None)
    leave_room(room)
    handle_status_update()


@socketio.on('newChatMessage')
def handle_message(data):
    conversation_id = data['roomId']
    from_username = request.args.get('user')
    body = data['body']
    created_at = datetime.datetime.utcnow().isoformat()
    data['createdAt'] = created_at

    # Emit to rest of users in conversation
    emit("newChatMessage", data, to=conversation_id)

    # Persist message to db
    add_message(conversation_id, from_username, body, created_at)


def handle_status_update():
    emit('onlineStatusUpdate', users, broadcast=True)
