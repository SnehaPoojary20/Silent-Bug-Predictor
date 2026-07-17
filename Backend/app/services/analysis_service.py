from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.analysis import Analysis, AnalysisResult
from app.services.github_service import fetch_repo_data
from app.services.ast_service import extract_ast_features
from app.services.ml_service import predict_bug_probability


async def run_analysis(
    db: AsyncSession,
    owner: str,
    repo: str,
    user_id: int,
) -> Analysis:
    raw_files = await fetch_repo_data(owner, repo)

    enriched = []
    for file_data in raw_files:
        ast_features = extract_ast_features(file_data["content"])
        combined = {**file_data, **ast_features}
        probability, risk_level = predict_bug_probability(combined)
        enriched.append(
            {
                "file_name": combined["file_name"],
                "bug_probability": probability,
                "risk_level": risk_level,
            }
        )

    enriched.sort(key=lambda x: x["bug_probability"], reverse=True)

    analysis = Analysis(
        owner=owner,
        repo=repo,
        total_files=len(enriched),
        user_id=user_id,
    )
    db.add(analysis)
    await db.flush()

    for item in enriched:
        db.add(
            AnalysisResult(
                analysis_id=analysis.id,
                file_name=item["file_name"],
                bug_probability=item["bug_probability"],
                risk_level=item["risk_level"],
            )
        )

    await db.commit()

    result = await db.execute(
        select(Analysis)
        .where(Analysis.id == analysis.id)
        .options(selectinload(Analysis.results))
    )
    return result.scalar_one()


async def get_user_analyses(db: AsyncSession, user_id: int) -> list[Analysis]:
    result = await db.execute(
        select(Analysis)
        .where(Analysis.user_id == user_id)
        .options(selectinload(Analysis.results))
        .order_by(Analysis.created_at.desc())
    )
    return result.scalars().all()


async def get_analysis_by_id(
    db: AsyncSession,
    analysis_id: int,
    user_id: int,
) -> Analysis | None:
    result = await db.execute(
        select(Analysis)
        .where(
            Analysis.id == analysis_id,
            Analysis.user_id == user_id,
        )
        .options(selectinload(Analysis.results))
    )
    return result.scalar_one_or_none()