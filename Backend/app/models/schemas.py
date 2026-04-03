from pydantic import BaseModel
from typing import List

class RepoRequest(BaseModel):
    repo_url:str

class FileRisk(BaseModel):
    file: str
    risk_score: float

class PredictionResponse(BaseModel):
    results: List[FileRisk]