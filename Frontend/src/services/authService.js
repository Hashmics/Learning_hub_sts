import axios from "axios";

const API_URL = "";

export const registerUser = async ({ name, email, password, role }) => {
    const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        role
    });
    return response.data;
};

export const loginUser = async ({ email, password }) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password
    });
    return response.data;
};

export const getMe = async (token) => {
    const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
