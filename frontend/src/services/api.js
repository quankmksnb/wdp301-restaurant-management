import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // ← Nếu body là FormData → xóa Content-Type
        // để browser/axios tự set multipart/form-data + boundary đúng
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("FULL ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    return Promise.reject(error);
  }
);

export default api;