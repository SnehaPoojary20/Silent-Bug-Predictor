from fastapi import FastAPI
from app.routes.routes import router  

app = FastAPI()

app.include_router(router)  

@app.get("/")
def greet():
    return {"message": "Welcome to Silent Bug Detector"}