import unittest
from models.base import db
from models.application_session import ApplicationSession
from app import app


class TestScheduledCheck(unittest.TestCase):

    def setUp(self):
        self.test_client = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
    

    def test_scheduled_check(self):
        resp = self.test_client.get('/bodymaps/api/scheduled_check')
        print(resp.text)
        self.assertEqual(4, 4)
    
    







if __name__ == "__main__":
    unittest.main()