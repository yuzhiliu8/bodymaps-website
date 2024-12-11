from models.base import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import JSON, String, DateTime

class ApplicationSession(db.Model):
    __tablename__ = "application_session"

    session_id: Mapped[str] = mapped_column(primary_key=True, unique=True)
    main_nifti_path: Mapped[str] = mapped_column(type_=String,  nullable=False)
    combined_labels_path: Mapped[str] = mapped_column(type_=String)
    organ_intensities: Mapped[JSON] = mapped_column(type_=JSON)
    session_created: Mapped[DateTime] = mapped_column(type_=DateTime) 

    def __str__(self):
        return f'''
        ApplicationSession OBJECT:
            session_id: {self.session_id} 
            main_nifti_path: {self.main_nifti_path} 
            combined_files_path: {self.combined_labels_path} 
            organ_intensities: {self.combined_labels_metadata} 
            session_created: {self.session_created}'''



