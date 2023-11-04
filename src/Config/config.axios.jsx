import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
// Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log(config);
    config.headers.Authorization = "token test ";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
