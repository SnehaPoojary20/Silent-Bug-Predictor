from fastapi import APIRouter
from services.github_service import fetch_repo_metrics

router = APIRouter()

@router.get("/github/repo_details")
def get_repo_details(repo_name: str):
    
    data = fetch_repo_metrics(repo_name)

    return data