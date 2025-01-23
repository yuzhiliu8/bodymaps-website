from models.base import db
from models.application_session import ApplicationSession
from models.combined_labels import CombinedLabels
from datetime import datetime, timedelta
from constants import Constants
import uuid
import shutil
import os


class SessionManager(object):
    _instance = None

    def __init__(self):
        raise RuntimeError('This is a Singleton Class, call instance() instead')
    
    @classmethod
    def instance(cls):
        if cls._instance is None:
            print("Creating SessionManager Instance")
            cls._instance = cls.__new__(cls)
            #Complete any other necessary initialization here
        return cls._instance
    
    def generate_uuid(self):
        return str(uuid.uuid4())

    def validate_session(self, session_id):
        pass
        
    def validate_clabel(self, clabel_id):
        pass
        
    def terminate_session(self, session_id):
        
        stmt = db.select(ApplicationSession).where(ApplicationSession.session_id == session_id)
        resp = db.session.execute(stmt)
        app_session = resp.scalar()
        combined_labels_id = app_session.combined_labels_id

        stmt = db.select(CombinedLabels).where(CombinedLabels.combined_labels_id == combined_labels_id)
        resp = db.session.execute(stmt)
        combined_labels = resp.scalar()

        db.session.delete(app_session)
        db.session.delete(combined_labels)
        db.session.commit()
    

        try:
            print(f'removing session: {session_id}')
            shutil.rmtree(os.path.join(Constants.SESSIONS_DIR_NAME, session_id))
            return True
        except:
            return False

    def get_expired(self): #can only be used with app_context
        print("sched check")
        current_time = datetime.now()
        stmt = db.select(ApplicationSession).where(ApplicationSession.session_expire_date <= current_time)
        resp = db.session.execute(stmt)
        return resp.scalars().all()

