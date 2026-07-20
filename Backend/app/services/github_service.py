import re
from datetime import datetime, timezone

import httpx
from fastapi import HTTPException, status

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


async def _safe_get(client: httpx.AsyncClient, url: str, *, params: dict | None = None):
    try:
        response = await client.get(url, headers=HEADERS, params=params)
        response.raise_for_status()
        return response
    except httpx.TimeoutException:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="GitHub request timed out")
    except httpx.HTTPStatusError as exc:
        code = exc.response.status_code
        if code == 404:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="GitHub repository not found")
        if code == 403:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="GitHub rate limit reached")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"GitHub API error: {code}")
    except httpx.RequestError:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Unable to reach GitHub")


async def get_default_branch(client: httpx.AsyncClient, owner: str, repo: str) -> str:
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"
    response = await _safe_get(client, url)
    return response.json()["default_branch"]


async def get_python_files(client: httpx.AsyncClient, owner: str, repo: str, branch: str) -> list[str]:
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/git/trees/{branch}"
    response = await _safe_get(client, url, params={"recursive": "1"})
    tree = response.json().get("tree", [])
    return [
        item["path"]
        for item in tree
        if item.get("type") == "blob" and item.get("path", "").endswith(".py")
    ]


async def get_file_content(client: httpx.AsyncClient, owner: str, repo: str, path: str, branch: str) -> str:
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
    response = await _safe_get(client, url)
    return response.text


async def get_commit_stats(client: httpx.AsyncClient, owner: str, repo: str, path: str) -> dict:
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/commits"
    response = await _safe_get(client, url, params={"path": path, "per_page": 100})
    commits = response.json()

    if not commits:
        return {"commits": 0, "contributors": 0, "last_modified_days": 0}

    authors = {
        commit["author"]["login"]
        for commit in commits
        if commit.get("author") and commit["author"].get("login")
    }

    latest_date_str = commits[0]["commit"]["author"]["date"]
    latest_date = datetime.fromisoformat(latest_date_str.replace("Z", "+00:00"))
    days_since = (datetime.now(timezone.utc) - latest_date).days

    return {
        "commits": len(commits),
        "contributors": len(authors),
        "last_modified_days": days_since,
    }


async def fetch_repo_data(owner: str, repo: str) -> list[dict]:
    timeout = httpx.Timeout(30.0, connect=10.0)
    async with httpx.AsyncClient(follow_redirects=True, timeout=timeout) as client:
        branch = await get_default_branch(client, owner, repo)
        files = await get_python_files(client, owner, repo, branch)

        results = []
        for file_path in files:
            content = await get_file_content(client, owner, repo, file_path, branch)
            commit_stats = await get_commit_stats(client, owner, repo, file_path)
            results.append(
                {
                    "file_name": file_path,
                    "content": content,
                    **commit_stats,
                }
            )
        return results









# get branch
# get files
# get file content
# get commit stats
# fetch repo data

