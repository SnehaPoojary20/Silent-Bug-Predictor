from fastapi import APIRouter, Depends, HTTPException , status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.db.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.analysis import Analysis
from app.schemas.analysis import AnalyzeRequest, AnalyzeResponse, FileResult
from app.services.analysis_service import (
    run_analysis,
    get_user_analyses,
    get_analysis_by_id,
)

router = APIRouter()



@router.post("/",response_model=AnalyzeResponse, status_code=201)
async def analyze_repo(
    request:AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analysis = await run_analysis(
        db=db,
        owner=request.owner,
        repo=request.repo,
        user_id=current_user.id,
    )
    return analysis


    
