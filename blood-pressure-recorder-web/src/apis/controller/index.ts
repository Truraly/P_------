export * from "./default";
import { type AxiosRequestConfig } from "axios";
console.log("123", import.meta.env.VITE_API_BASE_URL);
export const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
};
