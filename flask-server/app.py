from flask import Flask
from flask_cors import CORS
from constants import Constants
from api.api_blueprint import api_blueprint
from models.base import db
from models.application_session import ApplicationSession
from models.combined_labels import CombinedLabels
from services.session_manager import SessionManager
# from datetime import datetime
import os

def create_session_dir():
    if not os.path.isdir(Constants.SESSIONS_DIR_NAME):
        os.mkdir(Constants.SESSIONS_DIR_NAME)

def create_app():
    create_session_dir()
    app = Flask(__name__)
    app.register_blueprint(api_blueprint, url_prefix=f'{Constants.BASE_PATH}/api')
    app.config['SQLALCHEMY_DATABASE_URI'] = Constants.SQLALCHEMY_DATABASE_URI

    try:
        db.init_app(app)
        print('connected to db')
    except: 
        print('Could not connect to DB!')
    CORS(app)
    with app.app_context():
        db.create_all()
    return app

app = create_app() 
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
