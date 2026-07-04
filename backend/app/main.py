from fastapi import FastAPI
from app.database import Base, engine
from app import models
from api.difficulties import router as difficulties_router 


app = FastAPI()

Base.metadata.create_all(bind= engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to Speech Practice App"}


app.include_router(difficulties_router)