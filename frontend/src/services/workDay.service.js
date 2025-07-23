import axios from "./root.service.js"; 
import cookies from "js-cookie";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

export async function getAllWorkdays() {
  try {
    const res = await axios.get("/workday/getAll");
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al obtener workdays";
  }
}

export async function createWorkdayManual(data) {
  try {
    const res = await axios.post("/workday/createManual", data);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al crear workday manual";
  }
}