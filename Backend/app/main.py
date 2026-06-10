from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, analysis

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])
app.include_router(auth.router, prefix="/auth")
app.include_router(analysis.router, prefix="/analysis")