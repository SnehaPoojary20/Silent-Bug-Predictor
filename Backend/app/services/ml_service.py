import logging
from pathlib import Path
import pickle

import numpy as np
from fastapi import HTTPException, status

logger = logging.getLogger("app.ml_service")

MODEL_PATH = Path("models/xgboost_model.pkl")
_model = None


def get_risk_level(probability: float) -> str:
    if probability >= 0.7:
        return "HIGH"
    if probability >= 0.4:
        return "MEDIUM"
    return "LOW"


def _build_feature_vector(file_data: dict) -> list[float]:
    return [
        float(file_data.get("loc", 0)),
        float(file_data.get("function_count", 0)),
        float(file_data.get("cyclomatic_complexity", 0)),
        float(file_data.get("commits", 0)),
        float(file_data.get("contributors", 0)),
        float(file_data.get("last_modified_days", 0)),
    ]


def _load_model():
    global _model
    if _model is not None:
        return _model

    if not MODEL_PATH.exists() or MODEL_PATH.stat().st_size == 0:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Model file missing at {MODEL_PATH}",
        )

    try:
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load ML model: {exc}",
        )

    logger.info("Loaded trained model from %s", MODEL_PATH)
    return _model


def predict_bug_probability(file_data: dict) -> tuple[float, str]:
    model = _load_model()
    features = _build_feature_vector(file_data)
    X = np.array([features], dtype=float)
    probability = float(model.predict_proba(X)[0][1])
    return probability, get_risk_level(probability)