from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreateRequest, UserLoginRequest, TokenResponse
from app.auth_utils import hash_password, verify_password, create_access_token

router= APIRouter()

@router.post("/auth/signup", response_model= TokenResponse)
def signup(user_data: UserCreateRequest, db:Session= Depends(get_db)):
      existing_user = db.query(User).filter(User.email == user_data.email).first()
    
      if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
      hashed = hash_password(user_data.password)
    
      new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed

       )
    
      db.add(new_user)
      db.commit()
      db.refresh(new_user)
    
      token = create_access_token({"user_id": new_user.id})
    
      return {"access_token": token, "token_type": "bearer"}

@router.post("/auth/login", response_model= TokenResponse)
def login(user_data: UserLoginRequest,db:Session= Depends(get_db)):
  user_exists= db.query(User).filter(User.email == user_data.email).first()

  if not user_exists:
    raise HTTPException(status_code=401, detail="User not found." )

  if not verify_password(user_data.password,user_exists.password):
    raise HTTPException(status_code= 401, detail= "User not found.")


  token =create_access_token({"user_id": user_exists.id})
  return{"access_token": token, "token_type": "bearer"}


