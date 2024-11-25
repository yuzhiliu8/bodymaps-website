from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class ModelBase(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=ModelBase)