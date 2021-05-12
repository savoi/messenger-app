import json

from flask import jsonify

def jsonify_bson(bson_object):
    return jsonify(json.loads(bson_object.to_json()))
