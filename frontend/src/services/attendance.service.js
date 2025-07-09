import axios from "./root.service.js";
import cookies from "js-cookie";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

export async function obtenerResumenAsistencia() {
  try {
    const res = await axios.get("/attendance/getAttendance", {
      headers: {
        Authorization: `Bearer ${cookies.get("token") || ""}`,
      },
    });
    return res.data; // Devuelve el JSON completo
  } catch (error) {
    return error.response?.data || {
      status: "Error",
      message: "Error desconocido",
      data: [],
    };
  }
}

export async function markAttendance(date, payload) {
  try {
    const token = cookies.get("token");

    if (!token) throw new Error("No hay token de autenticación");

    const res = await axios.post(
      `/attendance/markAttendance/${date}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    return error.response?.data || {
      status: "Error",
      message: "Error desconocido",
      data: null,
    };
  }
}