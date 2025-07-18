import axios from "./root.service.js";
import cookies from "js-cookie";
import { getDeviceToken } from "@/utils/deviceToken";

const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

function addRandomSuffix(token) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token + '-' + suffix;
}

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

export async function markAttendance(date, { latitude, longitude }) {
  try {
    let deviceToken = await getDeviceToken();
    deviceToken = addRandomSuffix(deviceToken); // agrego sufijo aleatorio para pruebas
    console.log("El deviceToken modificado es:", deviceToken);
    
    const token = cookies.get("token");
    //if (!token) throw new Error("No hay token de autenticación");
    console.log("La date que llegó al service es", date);
    const res = await axios.post(`${API_URL}/attendance/markAttendance/${date}`,
      {
        deviceToken,
        latitude,
        longitude,
      },
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
