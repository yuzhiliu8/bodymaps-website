from models.base import ModelBase
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import JSON, String, Integer

class CombinedLabels(ModelBase):

    __tablename__ = "combined_labels"

    combined_labels_id: Mapped[str] = mapped_column(primary_key=True, type_=String)
    combined_labels_path: Mapped[str] = mapped_column(type_=String)
    organ_intensities: Mapped[JSON] = mapped_column(type_=JSON)
    organ_metadata: Mapped[JSON] = mapped_column(type_=JSON)
    

    def __str__(self):
        return f"""
        CombinedLabels object
            id: {self.combined_labels_id}
            path: {self.combined_labels_path}
            organ_intensities: {self.organ_intensities}
            organ_metadata: {self.organ_metadata}
"""
