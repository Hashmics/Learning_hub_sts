import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("learnhub_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const enrollInCourse = async (courseId) => {
    const response = await api.post("/enroll", { courseId });
    return response.data;
};

export const getMyCourses = async () => {
    const response = await api.get("/my-courses");
    return response.data;
};

export const updateProgress = async (enrollmentId, progress) => {
    const response = await api.put(`/my-courses/${enrollmentId}`, { progress });
    return response.data;
};
