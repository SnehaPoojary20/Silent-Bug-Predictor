from github import Github
from collections import defaultdict
from datetime import datetime, timezone
import os

def fetch_repo_metrics(repo_name: str):

    token = os.getenv("GITHUB_TOKEN")
    g = Github(token)

    repo = g.get_repo(repo_name)
    commits = repo.get_commits()

    file_commit_count = defaultdict(int)
    file_contributors = defaultdict(set)   #  track unique contributors
    file_last_modified = {}                #  track last modified date

    for commit in commits[:200]:
        files = commit.files
        if files:
            for file in files:
                file_commit_count[file.filename] += 1

                #  track contributor
                file_contributors[file.filename].add(
                    commit.author.login if commit.author else "unknown"
                )

                #  (overwrites each time, ends up with most recent)
                file_last_modified[file.filename] = commit.commit.author.date

    data = []

    for file, count in file_commit_count.items():

        # days since last modified
        last_modified = file_last_modified.get(file)
        if last_modified:
         
            if last_modified.tzinfo is None:
                last_modified = last_modified.replace(tzinfo=timezone.utc)
            days_since = (datetime.now(timezone.utc) - last_modified).days
        else:
            days_since = 0

        data.append({
            "file_name": file,
            "commit_churn": count,
            "contributors": len(file_contributors[file]),   
            "days_since_modified": days_since,              
        })

    return data