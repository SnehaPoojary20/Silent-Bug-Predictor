import os
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
model = joblib.load(os.path.join(BASE_DIR, "data", "bug_model.pkl"))  

def predict_risk(features, file_names): 
    probs = model.predict_proba(features)[:, 1]
    
    results = []
    for i, file in enumerate(file_names):  
        results.append({
            "file": file,
            "risk_score": round(float(probs[i]), 4)
        })
    return sorted(results, key=lambda x: x["risk_score"], reverse=True)