from flask import Flask
from flask_cors import CORS
from constants import Constants
from api.api_blueprint import api_blueprint


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(api_blueprint, url_prefix=f'{Constants.BASE_PATH}/api')

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
