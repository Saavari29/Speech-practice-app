from fastapi import APIRouter,Depends, File, UploadFile, Form, HTTPException
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List 

from app.schemas import SpeechResponse

from app.database import get_db
from app.auth_utils import get_current_user
from app.ai_utils import analyze_speech

from app.models import Analysis
from app.models import Speech
from app.models import User


router = APIRouter()

@router.post("/speeches",response_model= SpeechResponse )
async def create_speech(
    topic: str= Form(...),
    difficulty_level_id: int= Form(...),
    audio_file: UploadFile= File(...),
    db: Session= Depends(get_db),
    current_user: User= Depends(get_current_user),
    duration: int= Form(...)):

    file_path= f"uploads/{audio_file.filename}"
    with open(file_path,"wb") as f:
        f.write(await audio_file.read())


    new_speech= Speech(
        user_id= current_user.id ,
        difficulty_level_id= difficulty_level_id ,
        audio_file= file_path,
        topic= topic,
        date=datetime.utcnow(),
        duration= duration
    )

    db.add(new_speech)
    db.commit()
    db.refresh(new_speech)

    

   
    try:

        analysis_result= analyze_speech(
        file_path= new_speech.audio_file,
        duration= new_speech.duration,
        topic= new_speech.topic
        ) 


        new_analysis= Analysis(
        speech_id= new_speech.id,
        transcript= analysis_result["transcript"],
        filler_words_count= analysis_result["filler_words_count"],
        filler_words_list= analysis_result["filler_words_list"],
        transcript_highlighted=analysis_result["transcript_highlighted"],
        relevance_score= analysis_result["relevance_score"],
        tone_consistency_score= analysis_result["tone_consistency_score"],
        overall_feedback= analysis_result["overall_feedback"],
        pace_wpm= analysis_result["pace_wpm"]

        )

        db.add(new_analysis)
        db.commit()
        db.refresh(new_analysis)
 
        


    except Exception as e:
        print(f"AI ERROR: {e}")  
        raise HTTPException(
            status_code= 500,
            detail= "Speech saved but AI analysis failed. Please try again."
        )
    return new_speech

    
     


@router.get("/speeches", response_model= List[SpeechResponse])
def get_speeches(db:Session= Depends(get_db), current_user: User= Depends(get_current_user)):
    speeches= db.query(Speech).filter(Speech.user_id == current_user.id).all()
    return speeches


