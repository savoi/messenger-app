import json


def test_register_user_success(client):
    new_user = {
        'username': "Jennifer_test",
        'email': "jennifer_test@fakemail.com",
        'password': "passwordjennifer"
    }
    response = client.post(
        '/register',
        data=json.dumps(new_user),
        mimetype='application/json'
    )
    assert response.status_code == 201
    assert response.json['message'] == "User successfully registered!"
    cookies = response.headers.get_all('Set-Cookie')
    assert any('access_token_cookie' in cookie for cookie in cookies)
    assert any('csrf_access_token' in cookie for cookie in cookies)


def test_register_email_already_exists(client):
    new_user = {
        'username': "John",
        'email': "john@fakemail.com",
        'password': "passwordjohn"
    }
    new_user_2 = {
        'username': "Henry",
        'email': "john@fakemail.com",
        'password': "passwordjohn"
    }
    response1 = client.post(
        '/register',
        data=json.dumps(new_user),
        mimetype='application/json'
    )
    response2 = client.post(
        '/register',
        data=json.dumps(new_user_2),
        mimetype='application/json'
    )
    assert response1.status_code == 201
    assert response1.json['message'] == "User successfully registered!"
    assert response2.status_code == 422
    assert response2.json['error']['status'] == "error"


def test_register_username_already_exists(client):
    new_user = {
        'username': "jupiter",
        'email': "jupiter@hellomail.com",
        'password': "passwordjupiter"
    }
    new_user_2 = {
        'username': "jupiter",
        'email': "jupiter@fakemail.com",
        'password': "passwordjupiter"
    }
    response1 = client.post(
        '/register',
        data=json.dumps(new_user),
        mimetype='application/json'
    )
    response2 = client.post(
        '/register',
        data=json.dumps(new_user_2),
        mimetype='application/json'
    )
    assert response1.status_code == 201
    assert response1.json['message'] == "User successfully registered!"
    assert response2.status_code == 422
    assert response2.json['error']['status'] == "error"


def test_register_missing_email(client):
    ER_MSG = "ValidationError (User:None) (Invalid email address: : ['email'])"
    new_user = {
        'username': "Chris",
        'email': "",
        'password': "passwordchris"
    }
    response = client.post(
        '/register',
        data=json.dumps(new_user),
        mimetype='application/json'
    )
    assert response.status_code == 422
    assert response.json['error']['validation_error'] == ER_MSG


def test_register_username_too_short(client):
    USERNAME_SHORT_MSG = "Your username must be at least 2 characters."
    new_user = {
        'username': "A",
        'email': "abcdefg@fakemail.com",
        'password': "passworda"
    }
    response = client.post(
        '/register',
        data=json.dumps(new_user),
        mimetype='application/json'
    )
    assert response.status_code == 422
    assert response.json['error']['username'] == USERNAME_SHORT_MSG


def test_login_success(client):
    non_existant_user = {
        'username': "testabc",
        'email': "testabc@fakemail.com",
        'password': "passwordtestabc"
    }
    response = client.post(
        '/register',
        data=json.dumps(non_existant_user),
        mimetype='application/json'
    )
    response = client.post(
        '/login',
        data=json.dumps(non_existant_user),
        mimetype='application/json'
    )
    assert response.status_code == 201
    assert response.json['message'] == "User login successful!"
    cookies = response.headers.get_all('Set-Cookie')
    assert any('access_token_cookie' in cookie for cookie in cookies)
    assert any('csrf_access_token' in cookie for cookie in cookies)


def test_login_failure_no_user(client):
    non_existant_user = {
        'email': "nonexistant@fakemail.com",
        'password': "passwordnonexistant"
    }
    response = client.post(
        '/login',
        data=json.dumps(non_existant_user),
        mimetype='application/json'
    )
    assert response.status_code == 422
    assert response.json['message'] == "The email/password is incorrect."


def test_login_failure_bad_password(client):
    non_existant_user = {
        'username': "test123",
        'email': "test123@fakemail.com",
        'password': "passwordtest123"
    }
    response = client.post(
        '/register',
        data=json.dumps(non_existant_user),
        mimetype='application/json'
    )
    non_existant_user['password'] = "incorrectpassword"
    response = client.post(
        '/login',
        data=json.dumps(non_existant_user),
        mimetype='application/json'
    )
    assert response.status_code == 422
    assert response.json['message'] == "The email/password is incorrect."
