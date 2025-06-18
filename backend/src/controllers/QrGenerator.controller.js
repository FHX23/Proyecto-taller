import { generateDailyAttendanceQR } from "../services/qr.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function generateDailyQRController(req, res) {
  try {
    const baseURL = `${req.protocol}://${req.get("host")}`;
    const [qrImage, error] = await generateDailyAttendanceQR(baseURL);

    if (error) return handleErrorServer(res, 500, error);

    handleSuccess(res, 200, "QR generated", { qrImage });
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
