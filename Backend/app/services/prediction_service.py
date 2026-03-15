import joblib

# Load the trained model
model = joblib.load("app/model/bug_model.pkl")


def predict_risk(features):

    # Predict probability of bug
    probabilities = model.predict_proba(features)[:, 1]

    return probabilities