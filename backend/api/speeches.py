from fastapi import APIRouter,Depends, File, UploadFile, Form
from app.database import get_db
from sqlalchemy.orm import Session
from app.models import Speech
from app.schemas import SpeechResponse
from app.models import User
from app.auth_utils import get_current_user
from datetime import datetime


router = APIRouter()

@router.post("/speeches",response_model= SpeechResponse )
async def create_speech(
    topic: str= Form(...),
    difficulty_level_id: int= Form(...),
    audio_file: UploadFile= File(...),
    db: Session= Depends(get_db),
    current_user: User= Depends(get_current_user)):

    file_path= f"uploads/{audio_file.filename}"
    with open(file_path,"wb") as f:
        f.write(await audio_file.read())


    new_speech= Speech(
        user_id= current_user.id ,
        difficulty_level_id= difficulty_level_id ,
        audio_file= file_path,
        topic= topic,
        date=datetime.utcnow()
    )

    db.add(new_speech)
    db.commit()
    db.refresh(new_speech)

    return new_speech



