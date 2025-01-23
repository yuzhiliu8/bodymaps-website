import unittest
from models.application_session import ApplicationSession
from models.base import db
from services.session_manager import SessionManager
from app import create_app
from psycopg2.errors import UniqueViolation
from datetime import datetime, timedelta


class TestApplicationSessionModel(unittest.TestCase):

    def setUp(self):
        self.db = db
        self.app = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.session_manager = SessionManager.instance()
        self.main_nifti_path='test-sessions/test-045'
        self.combined_labels_id=self.session_manager.generate_uuid()

        db.create_all()
    
    def tearDown(self):
        self.db.session.remove()
        self.app_context.pop()


    def test_insert_into_table(self):
        session_key = self.session_manager.generate_uuid()
        now = datetime.now()
        expire = now + timedelta(days=3)
        new_session = ApplicationSession(
            session_id=session_key,
            main_nifti_path=self.main_nifti_path,
            combined_labels_id=self.combined_labels_id,
            session_created=now,
            session_expire_date = expire, 
        )
        db.session.add(new_session)
        db.session.commit()

        stmt = db.select(ApplicationSession).where(ApplicationSession.session_id == session_key)
        res = db.session.execute(stmt)
        app_session = res.scalar()
        
        self.assertEqual(app_session.session_id, session_key)
        self.assertEqual(app_session.main_nifti_path, self.main_nifti_path)
        self.assertEqual(app_session.combined_labels_id, self.combined_labels_id)
        self.assertEqual(app_session.session_created, now)
        self.assertEqual(app_session.session_expire_date, expire)

        #cleanup from DB
        db.session.delete(app_session)
        db.session.commit()
    
    def test_duplicate_session_id(self):
        now = datetime.now()
        session_key = self.session_manager.generate_uuid()
        new_session = ApplicationSession(
            session_id=session_key,
            main_nifti_path=self.main_nifti_path,
            combined_labels_id=self.combined_labels_id,
            session_created=now,
            session_expire_date = now + timedelta(days=3)
        ) 

        db.session.add(new_session)
        db.session.commit()

        now = datetime.now()
        dup_key_session = ApplicationSession(
            session_id=session_key, #same session_id as new_session
            main_nifti_path="test/path",
            combined_labels_id="unique_combined_labels_id",
            session_created=now,
            session_expire_date = now + timedelta(days=3)
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
    
    def test_duplicate_combined_labels_id(self):
        now = datetime.now()
        session_key = self.session_manager.generate_uuid()
        new_session = ApplicationSession(
            session_id=session_key,
            main_nifti_path=self.main_nifti_path,
            combined_labels_id=self.combined_labels_id,
            session_created=now,
            session_expire_date = now + timedelta(days=3), 
        ) 

        db.session.add(new_session)
        db.session.commit()

        session_key2 = self.session_manager.generate_uuid()

        now = datetime.now()
        session_2 = ApplicationSession(
            session_id=session_key,
            main_nifti_path=self.main_nifti_path,
            combined_labels_id=self.combined_labels_id, #same as new_session
            session_created=now,
            session_expire_date = now + timedelta(days=3), 
        )
    
        with self.assertRaises(UniqueViolation):
            try:
                db.session.add(session_2)
                db.session.commit()
            except:
                raise UniqueViolation
        
        db.session.rollback()
        db.session.delete(new_session)
        db.session.commit()
 
                
                


if __name__ == "__main__":
    unittest.main()
