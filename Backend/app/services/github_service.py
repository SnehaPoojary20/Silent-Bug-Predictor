from github import Github
from collections import defaultdict
import os

def fetch_repo_metrics(repo_name: str):

    token = os.getenv("GITHUB_TOKEN")
    g = Github(token)

    repo = g.get_repo(repo_name)
    commits = repo.get_commits()

    file_commit_count = defaultdict(int)

    for commit in commits[:200]:

        files = commit.files

        if files:
            for file in files:
                file_commit_count[file.filename] += 1

    data = []

    for file, count in file_commit_count.items():
        data.append({
            "file_name": file,
            "commit_churn": count
        })

    return data