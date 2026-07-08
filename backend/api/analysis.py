from fastapi import APIRouter, Depends, HTTPException
from app.models import Analysis
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import AnalysisResponse
from app.auth_utils import get_current_user

router= APIRouter()

@router.get("/analysis/{speech_id}", response_model= AnalysisResponse)
def get_analysis(speech_id: int, db:Session= Depends(get_db), current_user: User= Depends(get_current_user)):
   analysis= db.query(Analysis).filter(Analysis.speech_id == speech_id).first()

   if not analysis:
    raise HTTPException(status_code= 404, detail= "Analysis not found.")


   return analysis
    


