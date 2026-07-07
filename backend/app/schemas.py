from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DifficultyLevelResponse(BaseModel):
    id: int
    name: str
    description: str
    min_duration: int
    max_duration: int
    prep_time: int

    class Config:
        from_attributes = True

class UserCreateRequest(BaseModel):
    name: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    
class SpeechResponse(BaseModel):
    id : int
    user_id : int
    difficulty_level_id : int
    audio_file : str
    date : datetime
    topic : str
    duration : Optional [int]= None
    transcript :Optional [str]= None

    class Config:
        from_attributes = True

