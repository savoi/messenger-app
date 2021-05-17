import datetime

from flask import Blueprint, request
from flask_socketio import emit, join_room, leave_room, send

from api import socketio
from api.utils import add_message

events = Blueprint('events', __name__)

users = {}


@socketio.on('join')
def on_join(data):
    username = data['username']
    conversationId = data['conversationId']
    join_room(conversationId)
    send(username + ' has entered the room.', to=conversationId)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)


@socketio.on('connect')
def connect():
    room = request.args.get('roomId')
    username = request.args.get('user')
    users[username] = {
        'sid': request.sid,
        'online': True,
    }
    handle_status_update()
    join_room(room)


@socketio.on('disconnect')
def disconnect():
    users.pop(request.args.get('user'), None)
    handle_status_update()
    leave_room(request.args.get('roomId'))


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
    emit('onlineStatusUpdate', users)
