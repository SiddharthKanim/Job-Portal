import axios from "axios";
import { LazyStore } from "@tauri-apps/plugin-store";

const store = new LazyStore(".auth.json");

const api = axios.create({
  baseURL: "http://localhost:8000",
});

api.interceptors.request.use(
  async (config) => {
    const token = await store.get("jwt");
    console.log("Stored Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
