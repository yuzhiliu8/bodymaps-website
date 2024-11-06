from flask import Blueprint, Flask, send_file, make_response, request, jsonify
from constants import Constants


api_blueprint = Blueprint('api', __name__)

@api_blueprint.route(f'{Constants.BASE_PATH}/api', methods=['GET'])
def home():
    return "api"