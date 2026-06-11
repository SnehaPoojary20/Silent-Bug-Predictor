from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Converts plain text password → hashed string
    
def hash_password(password:str)->str:
    return pwd_context.hash(password)

# check if plain password matches hashed password
def verify_password(plain_password:str, hashed_password:str)-> bool:
    return pwd_context.verify(plain_password, verify_password)

# Creates a JWT token.Token expires after ACCESS_TOKEN_EXPIRE_MINUTES (set in config)
def create_access_token(data:dict)-> str:
    to_encode=data.copy()
    expire=datetime.now(timezone.utc)+ timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({expire:expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


# Reads a JWT token and returns the payload.Raises JWTError if token is invalid or expired.
def  decode_token(token:str)-> dict:
    return jwt.decode(
        token,
        settings.SECRET_KEY,
         algorithms=[settings.ALGORITHM]
    )

    



