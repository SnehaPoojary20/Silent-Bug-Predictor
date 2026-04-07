import requests
import pandas as pd
import os
from dotenv import load_dotenv

# Load env
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

GITHUB_API = "https://api.github.com"


HEADERS = {
    "Accept": "application/vnd.github+json",
    "Authorization": f"Bearer {GITHUB_TOKEN}"
}

repos = [
    "tensorflow/tensorflow",
    "django/django",
    "microsoft/vscode"
]

data = []

def is_bug_commit(message):
    keywords = ["fix", "bug", "error", "issue", "patch"]
    return any(word in message.lower() for word in keywords)

for repo in repos:
    print(f"Fetching {repo}...")

    commits_url = f"{GITHUB_API}/repos/{repo}/commits"
    response = requests.get(commits_url, headers=HEADERS)

    #  Checking for API errors
    if response.status_code != 200:
        print("Error:", response.json())
        continue

    commits = response.json()

    for commit in commits[:50]:
        message = commit["commit"]["message"]

        bug_label = 1 if is_bug_commit(message) else 0

        data.append({
            "lines_added": len(message),  # placeholder
            "lines_deleted": len(message) // 2,
            "num_commits": 1,
            "num_authors": 1,
            "days_since_last_change": 1,
            "bug_label": bug_label
        })

df = pd.DataFrame(data)

# Make sure path exists
os.makedirs("../data", exist_ok=True)

# Save dataset
df.to_csv("../data/dataset.csv", index=False)

print("dataset.csv created successfully!")