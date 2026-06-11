from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import JWTError

from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import decode_token

# This tells FastAPI: "JWT token comes from /auth/login endpoint"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Dependency that gives routes a DB session.
#'async with' = open and auto-close (like try/finally)
#'yield' = pause here, give session to route, come back to close
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import JWTError

from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import decode_token

# This tells FastAPI: "JWT token comes from /auth/login endpoint"
# When a route needs auth, FastAPI automatically reads the
# Authorization: Bearer <token> header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_db():
    """
    Dependency that gives routes a DB session.
    
    Like a checkout counter:
    - Opens session when request arrives
    - Yields it to your route function
    - Closes it automatically when request is done
    
    'async with' = open and auto-close (like try/finally)
    'yield' = pause here, give session to route, come back to close
    """
    async with AsyncSessionLocal() as session:
        yield session

#  Dependency that protects routes.
# Any route that adds:  current_user = Depends(get_current_user)becomes a protected route automatically.
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
   
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
