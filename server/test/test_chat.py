import json


def test_add_new_message_success(client, tokens):
    new_message = {
        'to_username': "bill",
        'body': "Hi! How are you?"
    }
    client.set_cookie('127.0.0.1', 'access_token_cookie', tokens[0])
    response = client.post(
        '/messages',
        data=json.dumps(new_message),
        headers={
            'X-CSRF-TOKEN': tokens[1]
        },
        mimetype='application/json'
    )
    assert response.status_code == 201
    assert response.json['message'] == "Message added successfully."


def test_add_new_message_recipient_does_not_exist(client, tokens):
    RECIPIENT_DOES_NOT_EXIST_MSG = "The message recipient user does not exist."
    new_message = {
        'to_username': "wesley",
        'body': "Hi! How are you?"
    }
    client.set_cookie('127.0.0.1', 'access_token_cookie', tokens[0])
    response = client.post(
        '/messages',
        data=json.dumps(new_message),
        headers={
            'X-CSRF-TOKEN': tokens[1]
        },
        mimetype='application/json'
    )
    assert response.status_code == 400
    assert response.json['message'] == RECIPIENT_DOES_NOT_EXIST_MSG


def test_get_conversation_preview(client, tokens):

    messages = [
        {
            'to_username': "bill",
            'body': "Hi! How are you?"
        },
        {
            'to_username': "bill",
            'body': "Are you still there?"
        },
        {
            'to_username': "bill",
            'body': "Why won't you answer me??"
        }
    ]
    # Add messages
    for message in messages:
        client.set_cookie('127.0.0.1', 'access_token_cookie', tokens[0])
        response = client.post(
            '/messages',
            data=json.dumps(message),
            headers={
                'X-CSRF-TOKEN': tokens[1]
            },
            mimetype='application/json'
        )
    # Get conversation
    client.set_cookie('127.0.0.1', 'access_token_cookie', tokens[0])
    response = client.get(
        '/conversations',
        headers={
            'X-CSRF-TOKEN': tokens[1]
        },
        mimetype='application/json'
    )
    assert response.status_code == 200
    assert response.json[0]['messages'][0]['body'] == messages[2]['body']
