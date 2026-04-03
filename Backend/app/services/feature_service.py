import pandas as pd

def extract_features(data):
    
    df = pd.DataFrame(data)

    # Handle missing values
    df["commit_churn"] = df["commit_churn"].fillna(0)

    # Feature: file depth
    df["file_depth"] = df["file_name"].apply(lambda x: x.count("/"))

    # Keep filenames separately
    file_names = df["file_name"]

    # Only model features
    features = df[["commit_churn", "file_depth"]]

    return features, file_names
