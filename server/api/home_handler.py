from flask import jsonify, Blueprint

from models import User
from flask_login import login_required

home_handler = Blueprint('home_handler', __name__)

@home_handler.route('/welcome')
def welcome():
    users = User.objects()
    return jsonify({'welcomeMessage': 'Welcome!', "users": users})

@home_handler.route('/welcome-protected')
@login_required
def welcome_protected():
    return jsonify({"welcomeMessage": "Welcome to the login protected area!"})
