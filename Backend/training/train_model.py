import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

# Load dataset
df = pd.read_csv("training/training_data.csv")

# Features
X = df[["commit_churn", "file_depth"]]

# Target
y = df["buggy"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Create model
model = XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    eval_metric="logloss"
)

# Train model
model.fit(X_train, y_train)

# Predictions
predictions = model.predict(X_test)

# Accuracy report
print(classification_report(y_test, predictions))

# Create data directory if not exists
os.makedirs("data", exist_ok=True)

# Save model
joblib.dump(model, "data/bug_model.pkl")

print("Model saved successfully")
