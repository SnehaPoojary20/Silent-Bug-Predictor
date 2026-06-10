from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    GITHUB_TOKEN: str
    
    class Config:
        env_file = ".env"

settings = Settings()