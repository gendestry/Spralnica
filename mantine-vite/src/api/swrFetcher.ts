import axios from "axios";

export const fetcher = axios.create({
  baseURL: import.meta.env.VITE_FUNCTIONS_URL,
  timeout: 4000,
  // headers: {
  //   "Content-Type": "application/json",
  //   Connection: "Keep-Alive",
  //   Authorization: `Bearer test`,
  // },
});
