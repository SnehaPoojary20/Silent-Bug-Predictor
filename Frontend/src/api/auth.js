import api from "./api";

export async function register(email, password, githubAccount) {
  const response = await api.post("/auth/register", {
    email,
    password,
    github_account: githubAccount,
  });

  return response.data;
}

export async function login(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  const token = response.data?.access_token;
  if (token) {
    localStorage.setItem("token", token);
  }

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}