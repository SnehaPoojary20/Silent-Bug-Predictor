import joblib

# Load once (IMPORTANT for performance)
model = joblib.load("data/bug_model.pkl")

def predict_risk(features):

    probs = model.predict_proba(features)[:, 1]

    results = []
    
    # assuming features has 'file' column
    for i, file in enumerate(features["file"]):
        results.append({
            "file": file,
            "risk_score": float(probs[i])
        })

    return results