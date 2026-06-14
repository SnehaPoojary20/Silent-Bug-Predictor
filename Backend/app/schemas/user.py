from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    github_account: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    github_account: str


class Config:
    from_attributes = True 