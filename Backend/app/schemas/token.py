from pydantic import BaseModel


# What we send back after a successful login.
class TokenOut(BaseModel):
 
    access_token: str
    token_type: str = "bearer"