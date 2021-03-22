from flask import jsonify, Blueprint
home_handler = Blueprint('home_handler', __name__)


@home_handler.route('/welcome')
def welcome():
    return jsonify({'welcomeMessage': 'Welcome!'})
