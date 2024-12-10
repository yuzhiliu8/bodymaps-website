import unittest
from models.application_session import ApplicationSession
from models.base import db
from services.session_manager import SessionManager
from app import create_app
from psycopg2.errors import UniqueViolation
from datetime import datetime


class TestApplicationSessionModel(unittest.TestCase):

    def setUp(self):
        self.db = db
        self.app = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.session_manager = SessionManager.instance()
        
        self.session_key = self.session_manager.generate_session_key()
        self.main_nifti_path='test-sessions/test-045'
        self.combined_labels_path='test-sessions/test-045/combined_labels.nii.gz'
        self.combined_labels_metadata={"aorta.nii.gz": 1, "gall_bladder.nii.gz": 2}

        db.create_all()
    
    def tearDown(self):
        self.db.session.remove()
        self.app_context.pop()


    def test_insert_into_table(self):
        session_key = self.session_manager.generate_session_key()
        new_session = ApplicationSession(
            session_id=session_key,
            main_nifti_path=self.main_nifti_path,
            combined_labels_path=self.combined_labels_path,
            combined_labels_metadata=self.combined_labels_metadata,
            session_created=datetime.now()
        )
        db.session.add(new_session)
        db.session.commit()

        stmt = db.select(ApplicationSession).where(ApplicationSession.session_id == session_key)
        res = db.session.execute(stmt)
        app_session = res.scalar()
        
        self.assertEqual(app_session.session_id, session_key)
        self.assertEqual(app_session.main_nifti_path, self.main_nifti_path)
        self.assertEqual(app_session.combined_labels_path, self.combined_labels_path)
        self.assertEqual(app_session.combined_labels_metadata, self.combined_labels_metadata)

        #cleanup from DB
        db.session.delete(app_session)
        db.session.commit()
    
    def test_duplicate_session_id(self):
        session_key = self.session_manager.generate_session_key()

        new_session = ApplicationSession(
            session_id=session_key,
            main_nifti_path=self.main_nifti_path,
            combined_labels_path=self.combined_labels_path,
            combined_labels_metadata=self.combined_labels_metadata,
            session_created=datetime.now()
        )

        db.session.add(new_session)
        db.session.commit()

        dup_key_session = ApplicationSession(
            session_id=session_key,
            main_nifti_path="test/path",
            combined_labels_path="test/path/combined_labels.nii.gz",
            combined_labels_metadata={"metadata": 1},
            session_created=datetime.now()
        ) 
        
        with self.assertRaises(UniqueViolation):
            try:
                db.session.add(dup_key_session)
                db.session.commit()
            except:
                raise UniqueViolation
        
        db.session.rollback()
        db.session.delete(new_session)
        db.session.commit()
                
                


if __name__ == "__main__":
    unittest.main()
