import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("learnhub_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getAnalytics = async () => {
    const response = await api.get("/analytics");
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await api.put(`/users/${id}`, { role });
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};
