import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use((config) => {
  const data = sessionStorage.getItem("LoginUser");
  const userData = data ? JSON.parse(data) : null;

  if (userData?.token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${userData.token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.removeItem("LoginUser");
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;