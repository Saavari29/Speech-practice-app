
from fastapi import APIRouter , Depends
from app.models import DifficultyLevel
from app.database import get_db
from app.schemas import DifficultyLevelResponse
from sqlalchemy.orm import Session
from typing import List 

router = APIRouter()

@router.get("/difficulties", response_model = List[DifficultyLevelResponse])
def get_difficulties(db: Session = Depends(get_db)):
    difficulties = db.query(DifficultyLevel).all()
    return difficulties
