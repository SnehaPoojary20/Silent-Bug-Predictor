from datetime import datetime
import joblib
import os 

def health_check():
    model_loaded=False

    try:
        # Check if model exists and loads correctly
        model_path = "data/bug_model.pkl"

        if os.path.exists(model_path):
           joblib.load(model_path)
           model_loaded= True

    except Exception:
        model_loaded = False

    return{
        "status": "healthy",
        "service": "Silent Bug Predictor",
        "model_loaded": model_loaded,
        "timestamp": datetime.utcnow().isoformat()
    }
    


