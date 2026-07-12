import asyncio
import numpy as np
import xgboost as xgb
import pickle
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv()  # loads .env before app.core.config reads GITHUB_TOKEN

from app.services.github_service import (
    get_default_branch,
    get_python_files,
    get_file_content,
    get_commit_stats,
    get_file_bug_label,
)
from app.services.ast_service import extract_ast_features

TRAINING_REPOS = [
    ("pallets", "flask"),
    ("psf", "requests"),
    ("tiangolo", "fastapi"),
]

FILES_PER_REPO = 60
MODEL_PATH = Path("app/models/xgboost_model.pkl")


async def build_dataset():
    X, y = [], []

    async with httpx.AsyncClient(timeout=30) as client:
        for owner, repo in TRAINING_REPOS:
            print(f"Fetching {owner}/{repo} ...")
            branch = await get_default_branch(client, owner, repo)
            files = await get_python_files(client, owner, repo, branch)

            for path in files[:FILES_PER_REPO]:
                try:
                    content = await get_file_content(client, owner, repo, path, branch)
                    ast_features = extract_ast_features(content)
                    commit_stats = await get_commit_stats(client, owner, repo, path)
                    label = await get_file_bug_label(client, owner, repo, path)

                    features = [
                        ast_features["loc"],
                        ast_features["function_count"],
                        ast_features["cyclomatic_complexity"],
                        commit_stats["commits"],
                        commit_stats["contributors"],
                        commit_stats["last_modified_days"],
                    ]

                    X.append(features)
                    y.append(label)
                    print(f"  {path}: label={label}")

                except Exception as e:
                    print(f"  skipping {path}: {e}")
                    continue

    return np.array(X, dtype=float), np.array(y, dtype=int)


async def main():
    X, y = await build_dataset()

    print(f"\nDataset size: {len(X)} files, {int(y.sum())} positive (buggy) labels")

    if len(X) < 20:
        print("WARNING: dataset too small. Add more repos or raise FILES_PER_REPO.")
        return
    if y.sum() == 0 or y.sum() == len(y):
        print("WARNING: all labels are the same class. Model won't learn anything useful.")
        print("Try adding repos with more active bug-fix history.")
        return

    model = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.1,
        eval_metric="logloss",
    )
    model.fit(X, y)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print(f"\nSaved trained model to {MODEL_PATH}")


if __name__ == "__main__":
    asyncio.run(main())