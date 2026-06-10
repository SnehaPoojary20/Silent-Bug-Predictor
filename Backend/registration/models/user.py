from pydantic import BaseModel

class User(BaseModel):
    id:int
    email:str="johndoe@gmail.com"
    password:str
    github_account: str