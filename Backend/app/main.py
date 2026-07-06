# app/main.py
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError

from app.api.routes import auth, analysis
from app.db.session import engine, Base
from app.core.config import settings
from app.core.logging_config import setup_logging
from app.core.middleware import log_requests
from app.core.exceptions import (
    http_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)

setup_logging()
logger = logging.getLogger("app")



@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP
    logger.info("Starting up Silent Bug Predictor...")
  
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # SHUTDOWN
    logger.info("Shutting down...")
    await engine.dispose()


app = FastAPI(title="Silent Bug Predictor", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,   # e.g. ["https://yourfrontend.com"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


app.middleware("http")(log_requests)


app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(analysis.router, prefix="/analysis", tags=["Analysis"])


@app.get("/health")
async def health():
    return {"status": "ok"}