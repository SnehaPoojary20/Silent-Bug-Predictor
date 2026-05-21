from fastapi import APIRouter
from app.services.github_service import fetch_repo_metrics
from app.services.feature_service import extract_features
from app.services.prediction_service import predict_risk
from app.services.health_check import health_check

router = APIRouter()

@router.get("/health")
def get_health():
    return health_check()

@router.get("/github/repo_details")
def get_repo_details(repo_name: str):
    return fetch_repo_metrics(repo_name)


@router.post("/predict")
def predict(repo_name: str):
    
    # Step 1: Fetch repo data
    repo_data = fetch_repo_metrics(repo_name)

    # Step 2: Extract features
    features = extract_features(repo_data)

    # Step 3: Predict
    predictions = predict_risk(features)

    return predictions