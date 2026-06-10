from pydantic import BaseModel, EmailStr


class AnalyzeRequest(BaseModel):
    owner: str
    repo: str

class AnalyzeResponse(BaseModel):
    file_name: str
    bug_probability: float
    risk_level: str