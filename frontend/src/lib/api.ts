import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000/api",
  withCredentials: true,
});

export const getErr = (e: any) =>
  e?.response?.data?.message || e?.message || "Network error";
