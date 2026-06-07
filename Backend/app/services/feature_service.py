import pandas as pd

def extract_features(data):

    df = pd.DataFrame(data)

    df["commit_churn"] = df["commit_churn"].fillna(0)
    df["contributors"] = df["contributors"].fillna(1)        
    df["days_since_modified"] = df["days_since_modified"].fillna(0)  

   
    df["file_depth"] = df["file_name"].apply(lambda x: x.count("/"))

  
    file_names = df["file_name"]

    features = df[[
        "commit_churn",
        "contributors",
        "days_since_modified",
        "file_depth",
    ]]

    return features, file_names
