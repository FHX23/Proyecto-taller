import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { markAttendanceService } from "../services/attendance.service.js"
export async function markAttendanceController(req, res) {
  try {
    const userId = req.user?.id; // from JWT or session
    const { deviceToken, latitude, longitude } = req.body;
    const date = req.params.date; // from QR URL
    const ipAddress = req.ip;

    if (!userId || !deviceToken || !date)
      return handleErrorClient(res, 400, "Insufficient data");

    const [result, error] = await markAttendanceService({
      userId,
      deviceToken,
      latitude,
      longitude,
      ipAddress,
      date,
    });

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Attendance recorded", result);
  } catch (err) {
    handleErrorServer(res, 500, err.message);
  }
}
