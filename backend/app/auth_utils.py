from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User



oauth2_scheme = HTTPBearer()

pwd_context = CryptContext(
    schemes = ["bcrypt"], deprecated ="auto"
)

SECRET_KEY= os.getenv("SECRET_KEY", "fallback-secret-key")
ALGORITHM= "HS256"
ACCESS_TOKEN_EXPIRE_TIME= 30

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password:str)-> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict)-> str:
    to_encode = data.copy()
    expire= datetime.utcnow()+ timedelta(minutes= ACCESS_TOKEN_EXPIRE_TIME)
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm =ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials= Depends(oauth2_scheme),db:Session= Depends(get_db)):
    token = credentials.credentials

    try:
        payload= jwt.decode(token, SECRET_KEY,algorithms= ALGORITHM)
    except Exception as e:
        raise HTTPException(status_code= 401, detail= "Invalid Token")

    user_id= payload.get("user_id")

    if user_id is None:
       raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    return user