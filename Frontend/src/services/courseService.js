import axios from "axios";

const API_URL = "/courses";

const api = axios.create();

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("learnhub_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Get all courses
export const getCourses = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

// Get one course
export const getCourseById = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

// Add a course
export const addCourse = async (courseData) => {
    const response = await api.post(API_URL, courseData);
    return response.data;
};

// Update a course
export const updateCourse = async (id, courseData) => {
    const response = await api.put(`${API_URL}/${id}`, courseData);
    return response.data;
};

// Delete a course
export const deleteCourse = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

export const addLesson = async (courseId, lesson) => {
    const response = await api.post(`${API_URL}/${courseId}/lessons`, lesson);
    return response.data;
};