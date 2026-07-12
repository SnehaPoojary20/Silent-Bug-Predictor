from pydantic import BaseModel
from datetime import datetime


class AnalyzeRequest(BaseModel):
    owner: str
    repo: str


class FileResult(BaseModel):
    file_name: str
    bug_probability: float
    risk_level: str

    class Config:
        from_attributes = True


class AnalyzeResponse(BaseModel):
    id: int
    owner: str
    repo: str
    total_files: int
    created_at: datetime
    results: list[FileResult]

    class Config:
        from_attributes = True