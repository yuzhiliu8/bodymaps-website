import secrets
import uuid
from werkzeug.datastructures import FileStorage

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
    
    def validate_session(self, session_key):
        pass
        