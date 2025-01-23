import unittest
from models.base import db
from models.application_session import ApplicationSession
from models.combined_labels import CombinedLabels
from services.session_manager import SessionManager
from app import app
from datetime import datetime


class TestScheduledCheck(unittest.TestCase):

    def setUp(self):
        self.app = app
        self.app_context = app.app_context()
        self.app_context.push()
    

    def test_scheduled_check(self):
        session_manager = SessionManager.instance()

        clabel_id = session_manager.generate_uuid()
        app_session = ApplicationSession(
            session_id = session_manager.generate_uuid(),
            main_nifti_path = "path", 
            combined_labels_id = clabel_id, 
            session_created = datetime(2025, 1, 7),
            session_expire_date = datetime(2025, 1, 12)
        )

        clabel = CombinedLabels(
            combined_labels_id = clabel_id, 
            combined_labels_path = "path",
            organ_intensities = {},
            organ_metadata = {}
        )

        db.session.add(app_session)
        db.session.add(clabel)
        db.session.commit()

        expired = session_manager.get_expired()

        for app_session in expired:
            print(app_session.session_id)
            print(session_manager.terminate_session(app_session.session_id))
        
        self.assertEqual(4, 4)
    
    







if __name__ == "__main__":
    unittest.main()