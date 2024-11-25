from models.base import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from sqlalchemy import JSON, String, DateTime

class ApplicationSession(db.Model):
    __tablename__ = "application_session"

    session_id: Mapped[str] = mapped_column(primary_key=True, unique=True)
    main_nifti_path: Mapped[str] = mapped_column(type_=String,  nullable=False)
    combined_files_path: Mapped[str] = mapped_column(type_=String)
    combined_files_metadata: Mapped[JSON] = mapped_column(type_=JSON)
    session_created: Mapped[DateTime] = mapped_column(type_=DateTime) 



