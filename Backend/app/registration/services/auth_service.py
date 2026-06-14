from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result=db.execute(select(User).where(User.email==email))
    return result.scalar_one_or_none()


async def register_user(db: AsyncSession, user_in: UserCreate)-> User:
    existing_user = await get_user_by_email(db, user_in.email)

    if existing_user:
           raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )
    
    new_user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        github_account=user_in.github_account,
    )

    db.add(new_user)
    await db.commit()       
    await db.refresh(new_user)  # Give back the saved row including its new ID

    return new_user
























# get user
# register user
# authenticate user