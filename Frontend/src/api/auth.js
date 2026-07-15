import api from "./api";

export async function register(name, email, password) {
    const response = await api.post("/auth/register", {
        name,
        email,
        password,
    });

    return response.data;
}

export async function login(email, password) {

    const response = await api.post("/auth/login", {
        email,
        password,
    });

    localStorage.setItem(
        "token",
        response.data.access_token
    );

    return response.data;
}