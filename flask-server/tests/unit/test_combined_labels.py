import unittest
from models.combined_labels import CombinedLabels
from app import create_app
from services.session_manager import SessionManager
from psycopg2.errors import UniqueViolation
from models.base import db

class TestCombinedLabels(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.session_manager = SessionManager.instance()
        db.create_all()

        self.combined_labels_id = self.session_manager.generate_uuid()
        self.combined_labels_path = "session_id/combined_labels.nii.gz"
        self.organ_intensities = {"aorta": 1}
        self.organ_metadata = {"aorta": {"meanHU": 30, "volume": 25}}
    

    def test_insert_combined_labels(self):
        combined_labels  = CombinedLabels(
            combined_labels_id = self.combined_labels_id,
            combined_labels_path = self.combined_labels_path,
            organ_intensities = self.organ_intensities,
            organ_metadata = self.organ_metadata
        )


        db.session.add(combined_labels)
        db.session.commit()

        stmt = db.select(CombinedLabels).where(CombinedLabels.combined_labels_id == self.combined_labels_id)
        resp = db.session.execute(stmt)
        clabel = resp.scalar()

        self.assertEqual(clabel.combined_labels_id, self.combined_labels_id)
        self.assertEqual(clabel.combined_labels_path, self.combined_labels_path)
        self.assertEqual(clabel.organ_intensities, self.organ_intensities)
        self.assertEqual(clabel.organ_metadata, self.organ_metadata)

        db.session.delete(clabel)
        db.session.commit()
    
    def test_duplicated_unique_id(self):
        combined_labels  = CombinedLabels(
            combined_labels_id = self.combined_labels_id,
            combined_labels_path = self.combined_labels_path,
            organ_intensities = self.organ_intensities,
            organ_metadata = self.organ_metadata
        )

        db.session.add(combined_labels)
        db.session.commit()

        new_clabel = CombinedLabels(
            combined_labels_id = self.combined_labels_id,
            combined_labels_path = "path",
            organ_intensities = {},
            organ_metadata = {} 
        )

        with self.assertRaises(UniqueViolation):
            try:
                db.session.add(new_clabel)
                db.session.commit()
            except:
                raise UniqueViolation

        db.session.rollback()
        db.session.delete(combined_labels)
        db.session.commit() 

if __name__ == "__main__":
    unittest.main()