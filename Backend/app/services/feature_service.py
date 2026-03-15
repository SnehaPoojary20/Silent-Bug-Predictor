import pandas as pd

def create_features(data):
    
    # Converting GitHub data into a Pandas DataFrame
    df = pd.DataFrame(data)

    # Handling missing values
    df["commit_churn"] = df["commit_churn"].fillna(0)

    # Feature 1: commit churn 
    # Feature 2: file depth (how deep file is in folder structure)
    df["file_depth"] = df["file_name"].apply(lambda x: x.count("/"))

    # Select only numerical features for ML model
    features = df[["commit_churn", "file_depth"]]

    # Return features + filenames (for mapping predictions later)
    return features, df["file_name"]
