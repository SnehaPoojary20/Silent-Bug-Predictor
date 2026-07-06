from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate, UserLogin, UserOut

from app.db.dependencies import get_db
from app.schemas.user import UserCreate, UserOut
from app.schemas.token import TokenOut          # we'll define this below
from app.services.auth_service import register_user, authenticate_user
from app.core.security import create_access_token

router = APIRouter()



@router.post("/register", response_model=UserOut, status_code=201)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
   
    user = await register_user(db, user_in)
    return user



@router.post("/login", response_model=TokenOut)
async def login(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    user = await authenticate_user(db, user_in.email, user_in.password)
    
    # "sub" = subject - who is this token about?
    token = create_access_token({"sub": str(user.id)})
    
    return {"access_token": token, "token_type": "bearer"}