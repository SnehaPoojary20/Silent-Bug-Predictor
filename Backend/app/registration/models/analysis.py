from datetime import datetime
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(
        primary_key=True, 
        index=True
        )
    
    owner: Mapped[str] = mapped_column(
        String, 
        nullable=False
        )
    
    repo: Mapped[str] = mapped_column(
        String, 
        nullable=False
        )
    
    total_files: Mapped[int] = mapped_column(
        Integer, 
        default=0
        )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
        )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), 
        nullable=False
        )

    results: Mapped[list["AnalysisResult"]] = relationship(
        back_populates="analysis",
        cascade="all, delete-orphan",  # delete line items if the receipt is deleted
    )


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

   
    analysis_id: Mapped[int] = mapped_column(
        ForeignKey("analyses.id"), 
        nullable=False
        )

    file_name: Mapped[str] = mapped_column(
        String, 
        nullable=False
        )
    
    bug_probability: Mapped[float] = mapped_column(
        Float,
        nullable=False
        )
    
    risk_level: Mapped[str] = mapped_column(
        String, 
        nullable=False
        )

       
    analysis: Mapped["Analysis"] = relationship(back_populates="results")
