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
from flask_login import login_user

from db.db import add_user, get_user

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
            login_user(user)
            return jsonify({'response': "User successfully registered!"}), 201
        except Exception as e:
            return jsonify({'error': {'internal': e}}), 500

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = ""
        password = ""
        try:
            post_data = request.get_json()
            email = post_data.get('email')
            password = post_data.get('password')
        except Exception as e:
            return jsonify({'error': str(e)}), 400

        # Check if user exists
        AUTH_ERROR = {'error': {'auth': "The email/password is incorrect."}}
        user = get_user(email)
        if not user:
            return jsonify(AUTH_ERROR), 422

        # Compare password hashes
        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify(AUTH_ERROR), 422

        try:
            login_user(user)
            next = request.args.get('next')
            if next and not is_safe_url(next, {request.host}):
                return abort(400)
            return redirect(next or url_for('home_handler.welcome_protected'))
        except Exception as e:
            return jsonify({'error': {'internal': e}}), 500

    return jsonify({'response': "Welcome to the login page!"}), 200
