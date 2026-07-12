import numpy as np
import xgboost as xgb
import pickle
import logging
from pathlib import Path

logger = logging.getLogger("app.ml_service")

MODEL_PATH = Path("app/models/xgboost_model.pkl")


def get_risk_level(probability: float) -> str:
    if probability >= 0.7:
        return "HIGH"
    elif probability >= 0.4:
        return "MEDIUM"
    else:
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


def _load_model() -> xgb.XGBClassifier:
    if not MODEL_PATH.exists() or MODEL_PATH.stat().st_size == 0:
        raise RuntimeError(
            f"No trained model found at {MODEL_PATH}. "
            f"Run `python train_model.py` from the Backend/ folder first."
        )
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    logger.info(f"Loaded trained model from {MODEL_PATH}")
    return model


_model = _load_model()


def predict_bug_probability(file_data: dict) -> tuple[float, str]:
    features = _build_feature_vector(file_data)
    X = np.array([features])
    probability = float(_model.predict_proba(X)[0][1])
    risk_level = get_risk_level(probability)
    return probability, risk_level