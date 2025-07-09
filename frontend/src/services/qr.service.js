import axios from "./root.service.js";
import cookies from "js-cookie";
const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

export async function obtenerQR() {
  try {
    const { data } = await axios.get("/qr/dailyQr");
    // Si quisieras formatear, podrías usar una función como formatQRData(data.data)
    console.log(data.data);
    return data.data; // retorna directamente el objeto `{ qrImage: ... }`
  } catch (error) {
    return error.response?.data || { status: "Error", message: "Error desconocido" };
  }
}