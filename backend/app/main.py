from dotenv import load_dotenv
load_dotenv()

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.database import Base, engine
from app import models
from api.difficulties import router as difficulties_router 
from api.auth import router as auth_router
from api.speeches import router as speech_router
from api.analysis import router as analysis_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind= engine)



@app.get("/")
def read_root():
    return {"message": "Welcome to Speech Practice App"}
   


app.include_router(difficulties_router)

app.include_router(auth_router)

app.include_router(speech_router)

app.include_router(analysis_router)
