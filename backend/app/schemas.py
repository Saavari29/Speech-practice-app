from pydantic import BaseModel

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
    
