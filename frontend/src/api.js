import axios from "axios";

const API = axios.create({
  baseURL: "http://44.202.159.158/api/",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
