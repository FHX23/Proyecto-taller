import axios from "./root.service.js"; 
import cookies from "js-cookie";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

export async function register(data) {
  try {
    const response = await axios.post("/auth/register");
    return response.data;
  } catch (error) {
      throw error.response?.data?.message || "Hubo un problema al crear al crear workday.";
  }
}
