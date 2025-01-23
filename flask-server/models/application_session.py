from models.base import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime

class ApplicationSession(db.Model):
    __tablename__ = "application_session"

    session_id: Mapped[str] = mapped_column(primary_key=True, unique=True, type_=String)
    main_nifti_path: Mapped[str] = mapped_column(type_=String,  nullable=False)
    combined_labels_id: Mapped[str] = mapped_column(unique=True, type_=String)
    session_created: Mapped[DateTime] = mapped_column(type_=DateTime) 
    session_expire_date: Mapped[DateTime] = mapped_column(type_=DateTime)

    def __str__(self):
        return f'''
        ApplicationSession OBJECT:
            session_id: {self.session_id} 
            main_nifti_path: {self.main_nifti_path} 
            combined_files_path: {self.combined_labels_id} 
            session_created: {self.session_created}
            session_expires: {self.session_expire_date}'''



