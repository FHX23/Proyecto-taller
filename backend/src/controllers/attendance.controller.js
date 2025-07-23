import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import { markAttendanceService } from "../services/attendance.service.js";
import { getUserAttendanceCounts } from "../services/attendance.service.js";
import dayjs from "dayjs";

export async function markAttendanceController(req, res) {
  try {
    const userId = req.user?.id; // from JWT or session
    const { deviceToken, latitude, longitude } = req.body;
    const date = req.params.date; // from QR URL
    const ipAddress = req.ip;

    //! cambiar por joi
    if (!userId || !deviceToken || !date)
      return handleErrorClient(res, 400, "Data insuficiente");

    const [result, error] = await markAttendanceService({
      userId,
      deviceToken,
      latitude,
      longitude,
      ipAddress,
      date,
    });

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Asistencia registrada", result);
  } catch (err) {
    handleErrorServer(res, 500, err.message);
  }
}

export async function getAttendanceSummaryController(req, res) {
  try {
    const { startDate, endDate } = req.query;

    // Validaciones
    if (!startDate || !endDate) {
      return handleErrorServer(res, 400, "Debe proporcionar fechas de inicio y fin.");
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const today = dayjs();

    if (!start.isValid() || !end.isValid()) {
      return handleErrorServer(res, 400, "Formato de fecha inválido.");
    }

    if (start.year() < 2025 || end.year() < 2025) {
      return handleErrorServer(res, 400, "El año mínimo permitido es 2025.");
    }

    if (start.isAfter(end)) {
      return handleErrorServer(res, 400, "La fecha de inicio no puede ser posterior a la fecha final.");
    }

    if (end.isAfter(today)) {
      return handleErrorServer(res, 400, "La fecha final no puede ser posterior al día de hoy.");
    }

    const [data, error] = await getUserAttendanceCounts(start.toISOString(), end.toISOString());
    if (error) return handleErrorServer(res, 500, error);

    handleSuccess(res, 200, "Datos obtenidos con éxito", data);
  } catch (err) {
    handleErrorServer(res, 500, err.message);
  }
}