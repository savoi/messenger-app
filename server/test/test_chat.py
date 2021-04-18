from flask import url_for
from mongoengine import connect, disconnect
import json

from api.models.conversation import Message
from api.models.user import User

def test_add_new_message_success(client, tokens):
    new_message = {
        'dest_username': "bill",
        'body': "Hi! How are you?"
    }
    client.set_cookie('127.0.0.1', 'access_token_cookie', tokens[0])
    response = client.post(
        '/messages',
        data=json.dumps(new_message),
        headers = {
            'X-CSRF-TOKEN': tokens[1]
        },
        mimetype='application/json'
    )
    assert response.status_code == 201
    assert response.json['message'] == "Message added successfully."

def test_add_new_message_recipient_does_not_exist(client, tokens):
    new_message = {
        'dest_username': "wesley",
        'body': "Hi! How are you?"
    }
    client.set_cookie('127.0.0.1', 'access_token_cookie', tokens[0])
    response = client.post(
        '/messages',
        data=json.dumps(new_message),
        headers = {
            'X-CSRF-TOKEN': tokens[1]
        },
        mimetype='application/json'
    )
    assert response.status_code == 400
    assert response.json['message'] == "Dest user does not exist."

def test_get_conversation_preview(client, tokens):
    messages = [
        {
            'dest_username': "bill",
            'body': "Hi! How are you?"
        },
        {
            'dest_username': "bill",
            'body': "Are you still there?"
        },
        {
            'dest_username': "bill",
            'body': "Why won't you answer me??"
        }
    ]
    # Add messages
    for message in messages:
        client.set_cookie('127.0.0.1', 'access_token_cookie', tokens[0])
        response = client.post(
            '/messages',
            data=json.dumps(message),
            headers = {
                'X-CSRF-TOKEN': tokens[1]
            },
            mimetype='application/json'
        )
    # Get conversation
    client.set_cookie('127.0.0.1', 'access_token_cookie', tokens[0])
    response = client.get(
        '/conversations',
        headers = {
            'X-CSRF-TOKEN': tokens[1]
        },
        mimetype='application/json'
    )
    assert response.status_code == 200
    assert response.json[0]['messages'][0]['body'] == "Why won't you answer me??"
