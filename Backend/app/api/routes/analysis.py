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



@router.get("/", response_model=list[AnalyzeResponse])
async def list_analyses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analyses = await get_user_analyses(db, current_user.id)
    return analyses



@router.get("/{analysis_id}", response_model=AnalyzeResponse)
async def get_analysis(
    analysis_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Analysis)
        .where(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id,
        )
        .options(selectinload(Analysis.results))  # load file results too
    )
    analysis = result.scalar_one_or_none()

    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found",
        )

    return analysis