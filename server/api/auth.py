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
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies
)

from api.models.user import User
add_user = User.add_user
get_user = User.get_user

auth = Blueprint('auth', __name__)

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
        return jsonify({'status': 'fail', 'error': errors}), 422

    # Attempt to add user to db. Hash and salted pass.
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    add_user_response = add_user(username, email, hashed_password)
    if 'error' in add_user_response:
        errors.update(add_user_response['error'])

    if len(errors.keys()) != 0:
        return jsonify({'error': errors}), 422
    else:
        try:
            user = get_user(email)
            response = jsonify({'success': "User successfully registered!"})
            access_token = create_access_token(identity=user.email)
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
    AUTH_ERROR = {'status': "error", 'message': "The email/password is incorrect."}
    user = get_user(email)
    if not user:
        return jsonify(AUTH_ERROR), 422

    # Compare password hashes
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify(AUTH_ERROR), 422

    try:
        response = jsonify({'success': "User login successful!"})
        access_token = create_access_token(identity=user.email)
        set_access_cookies(response, access_token)
        return response, 201
    except Exception as e:
        return jsonify({'error': {'internal': e}}), 500

@auth.route('/logout', methods=['POST'])
def logout():
    try:
        response = jsonify({'success': "User successfully logged out!"})
        unset_jwt_cookies(response)
        return response, 200
    except Exception as e:
        response = {'error': {'status': 'error', 'message': "Could not log out user."}}
        return jsonify(response), 500

@auth.route('/user', methods=['POST'])
@jwt_required()
def user():
    try:
        current_user = get_jwt_identity()
        response = {'current_user': current_user}
        return jsonify(response), 200
    except Exception as e:
        response = {'error': {'auth': "Could not fetch user."}}
        return jsonify(response), 500
