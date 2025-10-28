import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,                    // 🔑 gửi cookie HttpOnly
});

export function getErr(e: any) {
  return e?.response?.data?.message || e?.message || "Network error";
}
