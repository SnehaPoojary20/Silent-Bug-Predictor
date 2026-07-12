import numpy as np
import xgboost as xgb
import pickle
from pathlib import Path


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


def _load_or_create_model() -> xgb.XGBClassifier:
    
    #Loads model from disk if it exists.Otherwise trains a small DUMMY model so the app doesn't crash.

    X = np.array([
        [10,   1,  1,   2,  1, 300],   # tiny old file   = LOW
        [50,   5,  8,  20,  4,  10],   # medium activity = MEDIUM
        [200, 20, 40,  80, 12,   2],   # huge + active   = HIGH
        [15,   2,  2,   3,  1, 200],   # simple old      = LOW
        [120, 12, 25,  50,  8,   5],   # complex recent  = HIGH
        [30,   3,  4,   8,  2, 150],   # normal          = LOW
        [180, 18, 35,  60, 10,   3],   # very complex    = HIGH
        [45,   4,  7,  15,  3,  30],   # moderate        = MEDIUM
    ])
    y = np.array([0, 1, 1, 0, 1, 0, 1, 1])   # 0=no bug, 1=bug

    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        eval_metric="logloss",
    )
    model.fit(X, y)

    # Save 
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    return model




_model = _load_or_create_model()


def predict_bug_probability(file_data: dict) -> tuple[float, str]:
   
    features = _build_feature_vector(file_data)

    # XGBoost expects shape (n_samples, n_features) 
    X = np.array([features])

   
    probability = float(_model.predict_proba(X)[0][1])
    risk_level = get_risk_level(probability)

    return probability, risk_level