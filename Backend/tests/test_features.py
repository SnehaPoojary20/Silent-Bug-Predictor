from app.services.feature_service import extract_features

def test_extract_features_basic():
    sample_data = [
        {"file_name": "auth/login.py", "commit_churn": 5},
        {"file_name": "utils.py", "commit_churn": 2},
    ]
    features, file_names = extract_features(sample_data)
    
    assert len(features) == 2
    assert "commit_churn" in features.columns
    assert "file_depth" in features.columns
    assert list(file_names) == ["auth/login.py", "utils.py"]

def test_file_depth_calculation():
    sample_data = [{"file_name": "a/b/c.py", "commit_churn": 1}]
    features, _ = extract_features(sample_data)
    assert features.iloc[0]["file_depth"] == 2 