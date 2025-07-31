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

export async function obtenerResumenAsistencia(startDate, endDate) {
  try {
    const res = await axios.get(`/attendance/getAttendance`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${cookies.get("token") || ""}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Hubo un problema al obtener asistencias.";
  }
}

export async function markAttendance(date, { latitude, longitude }) {
  try {
    let deviceToken = await getDeviceToken();
    deviceToken = addRandomSuffix(deviceToken); // Para evitar conflictos en pruebas

    const res = await axios.post(`/attendance/markAttendance/${date}`, {
      deviceToken,
      latitude,
      longitude,
    });

    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Hubo un problema al marcar asistencia.";
  }
}

export async function getAttendancesByUserId(id) {
  try {
    const res = await axios.get(`/attendance/getAttendancesByUserId/${id}`);
    return res.data.data;
  } catch (error) {
    throw error.response?.data?.message || "No se pudieron obtener las asistencias del usuario.";
  }
}

export async function createManualAttendance(userId, date) {
  try {
    const res = await axios.post(`/attendance/markAttendanceManual`, {
      userId,
      date,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "No se pudo crear la asistencia manual.";
  }
}

export async function deleteManualAttendance(userId, date) {
  try {
    const res = await axios.delete(`/attendance/deletemAttendance`, {
      data: { userId, date },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "No se pudo eliminar la asistencia manual.";
  }
}