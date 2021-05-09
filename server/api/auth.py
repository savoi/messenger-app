import bcrypt

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies
)

from api.models.user import User

auth = Blueprint('auth', __name__)

ERROR_BAD_AUTH = {
    'status': "error",
    'message': "The email/password is incorrect."
}
ERROR_LOGOUT = {
    'status': 'error',
    'message': "Could not log out user."
}
ERROR_CANT_GET_USER = {
    'status': "error",
    'message': "Could not fetch user."
}
SUCCESS_LOGOUT = {
    'status': "success",
    'message': "User successfully logged out!"
}
SUCCESS_LOGIN = {
    'status': "success",
    'message': "User login successful!"
}
SUCCESS_REGISTER = {
    'status': "success",
    'message': "User successfully registered!"
}


@auth.route('/register', methods=['POST'])
def register():
    try:
        post_data = request.get_json()
        username = post_data.get('username')
        email = post_data.get('email')
        password = post_data.get('password')
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    # Server-side field validation
    errors = {}
    if len(username) < 2:
        errors['username'] = "Your username must be at least 2 characters."
    if len(password) < 6:
        errors['password'] = "Your password must be at least 6 characters."
    if len(errors.keys()) != 0:
        return jsonify({'status': "fail", 'error': errors}), 422

    # Attempt to add user to db. Hash and salted pass.
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    add_user_response = User.add(username, email, hashed_password)
    if add_user_response['status'] == "error":
        errors.update(add_user_response)

    if len(errors.keys()) != 0:
        return jsonify(errors), 422
    else:
        try:
            user = User.get(email)
            response = jsonify(SUCCESS_REGISTER)
            access_token = create_access_token(identity=user.username)
            set_access_cookies(response, access_token)
            return response, 201
        except Exception as e:
            return jsonify({'error': {'internal': e}}), 500


@auth.route('/login', methods=['POST'])
def login():
    email = ""
    password = ""
    try:
        post_data = request.get_json()
        email = post_data.get('email')
        password = post_data.get('password')
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    # Check if user exists
    user = User.get(email)
    if not user:
        return jsonify(ERROR_BAD_AUTH), 422

    # Compare password hashes
    password_hash = bcrypt.checkpw(
        password.encode('utf-8'), user['password'].encode('utf-8')
    )
    if not password_hash:
        return jsonify(ERROR_BAD_AUTH), 422

    try:
        response = jsonify(SUCCESS_LOGIN)
        access_token = create_access_token(identity=user.username)
        set_access_cookies(response, access_token)
        return response, 201
    except Exception as e:
        return jsonify({'error': {'internal': e}}), 500


@auth.route('/logout', methods=['POST'])
def logout():
    try:
        response = jsonify(SUCCESS_LOGOUT)
        unset_jwt_cookies(response)
        return response, 200
    except Exception:
        return jsonify(ERROR_LOGOUT), 500


@auth.route('/user', methods=['GET'])
@jwt_required()
def user():
    try:
        current_user = get_jwt_identity()
        response = {'current_user': current_user}
        return jsonify(response), 200
    except Exception:
        return jsonify(ERROR_CANT_GET_USER), 500
