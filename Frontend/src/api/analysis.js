import api from "./api";

export async function analyzeRepository(owner, repo) {
  const response = await api.post("/analysis/", {
    owner,
    repo,
  });
  return response.data;
}

export async function getAnalyses() {
  const response = await api.get("/analysis/");
  return response.data;
}

export async function getAnalysis(id) {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
}