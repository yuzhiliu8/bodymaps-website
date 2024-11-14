from flask import Flask
from flask_cors import CORS
from constants import Constants
from api.api_blueprint import api_blueprint
import os


def create_session_dir():
    if not os.path.isdir(Constants.SESSIONS_DIR_NAME):
        os.mkdir(Constants.SESSIONS_DIR_NAME)

def create_app():
    app = Flask(__name__)
    app.register_blueprint(api_blueprint, url_prefix=f'{Constants.BASE_PATH}/api')
    return app


if __name__ == "__main__":
    create_session_dir()
    app = create_app()
    CORS(app)
    app.run(host='0.0.0.0', port=5000, debug=True)
