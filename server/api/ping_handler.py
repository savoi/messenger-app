import json
from flask import jsonify, request, Blueprint
from config import TEAM_NAME
ping_handler = Blueprint('ping_handler', __name__)


@ping_handler.route('/ping', methods=['POST'])
def ping():
    if request.method == 'POST':
        body = json.loads(request.get_data())
        return jsonify({'response': "Server is running. Message received: {}".format(body['message'])}), 200
