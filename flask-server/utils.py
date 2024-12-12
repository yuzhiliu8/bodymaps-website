

class Utils:
    @classmethod
    def removeFileExt(cls, filename):
        return filename[:filename.index('.')]



#from services.session_manager import SessionManager

#s = SessionManager.instance()
#uuid = str(s.generate_session_key())
#print(uuid, type(uuid))