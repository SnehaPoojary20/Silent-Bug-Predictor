import re
from datetime import datetime, timezone
import httpx
from app.core.config import settings

GITHUB_API_BASE = "https://api.github.com"

HEADERS = {
    "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
}

BUG_KEYWORDS = re.compile(
    r"\b(fix|bug|error|crash|issue|patch|broken|fault|defect)\b",
    re.IGNORECASE,
)


async def get_default_branch(client: httpx.AsyncClient, owner: str, repo: str) -> str:
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"
    response = await client.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()["default_branch"]


async def get_python_files(client: httpx.AsyncClient, owner: str, repo: str, branch: str) -> list[str]:
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/git/trees/{branch}"
    response = await client.get(url, headers=HEADERS, params={"recursive": "1"})
    response.raise_for_status()

    tree = response.json()["tree"]

    return [
        item["path"]
        for item in tree
        if item["type"] == "blob" and item["path"].endswith(".py")
    ]


async def get_file_content(client: httpx.AsyncClient, owner: str, repo: str, path: str, branch: str) -> str:
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
    response = await client.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.text


async def get_commit_stats(client: httpx.AsyncClient, owner: str, repo: str, path: str) -> dict:
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/commits"
    response = await client.get(
        url, headers=HEADERS, params={"path": path, "per_page": 100}
    )
    response.raise_for_status()

    commits = response.json()

    if not commits:
        return {"commits": 0, "contributors": 0, "last_modified_days": 0}

    authors = set()
    for commit in commits:
        author = commit.get("author")
        if author and author.get("login"):
            authors.add(author["login"])

    latest_date_str = commits[0]["commit"]["author"]["date"]
    latest_date = datetime.fromisoformat(latest_date_str.replace("Z", "+00:00"))

    days_since = (datetime.now(timezone.utc) - latest_date).days

    return {
        "commits": len(commits),
        "contributors": len(authors),
        "last_modified_days": days_since,
    }


async def get_file_bug_label(client: httpx.AsyncClient, owner: str, repo: str, path: str) -> int:
    
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/commits"
    response = await client.get(
        url, headers=HEADERS, params={"path": path, "per_page": 50}
    )
    response.raise_for_status()
    commits = response.json()

    for commit in commits:
        message = commit["commit"]["message"]
        if BUG_KEYWORDS.search(message):
            return 1
    return 0


async def fetch_repo_data(owner: str, repo: str) -> list[dict]:

    async with httpx.AsyncClient() as client:
        branch = await get_default_branch(client, owner, repo)
        files = await get_python_files(client, owner, repo, branch)

        results = []
        for file_path in files:
            content = await get_file_content(client, owner, repo, file_path, branch)
            commit_stats = await get_commit_stats(client, owner, repo, file_path)

            results.append({
                "file_name": file_path,
                "content": content,
                **commit_stats,
            })

        return results









# get branch
# get files
# get file content
# get commit stats
# fetch repo data

