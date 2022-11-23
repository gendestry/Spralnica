import axios from "axios";
import { auth } from "../firebase";

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_FUNCTIONS_URL,
  timeout: 4000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth?.currentUser?.uid || ""}`,
  },
});
