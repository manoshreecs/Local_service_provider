import axios from "axios";

const API_BASE_URL =
    import.meta.env.MODE === "production" ?
    "https://backend-service-fyex.onrender.com/api" :
    "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default api;