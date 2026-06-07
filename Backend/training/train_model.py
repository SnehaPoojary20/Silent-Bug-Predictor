import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

df = pd.read_csv("training/training_data.csv")

X = df[["commit_churn", "contributors", "days_since_modified", "file_depth"]]
y = df["buggy"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    eval_metric="logloss"
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)
print(classification_report(y_test, predictions))

os.makedirs("data", exist_ok=True)
joblib.dump(model, "data/bug_model.pkl")
print("Model saved to data/bug_model.pkl")
