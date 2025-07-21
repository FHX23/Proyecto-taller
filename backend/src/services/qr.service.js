import QRCode from "qrcode";
import { format } from "date-fns";

export async function generateDailyAttendanceQR(baseURL) {
  const date = format(new Date(), "yyyy-MM-dd");
  const url = `${baseURL}/attendance/markAttendance/${date}`;
  try {
    const qr = await QRCode.toDataURL(url);
    return [qr, null];
  } catch (err) {
    console.error("Error al generar QR:", err);
    return [null, "Error interno del servidor al generar QR:"];
  }
}