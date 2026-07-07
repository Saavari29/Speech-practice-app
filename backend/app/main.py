from dotenv import load_dotenv
load_dotenv()


from fastapi import FastAPI
from app.database import Base, engine
from app import models
from api.difficulties import router as difficulties_router 
from api.auth import router as auth_router
from api.speeches import router as speech_router


app = FastAPI()

Base.metadata.create_all(bind= engine)



@app.get("/")
def read_root():
    return {"message": "Welcome to Speech Practice App"}
   


app.include_router(difficulties_router)

app.include_router(auth_router)

app.include_router(speech_router)
