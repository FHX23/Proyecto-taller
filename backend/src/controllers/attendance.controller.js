import dayjs from "dayjs";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import {
  markAttendanceService,
  getUserAttendanceCounts,
  getAttendancesByUserIdService,
  createManualAttendanceService,
  deleteManualAttendanceService,
} from "../services/attendance.service.js";
import {
  userParamsValidation,
} from "../validations/user.validation.js";

export async function markAttendanceController(req, res) {
  try {
    const userId = req.user?.id;
    const { deviceToken, latitude, longitude } = req.body;
    const date = req.params.date;
    const ipAddress = req.ip;

    if (!userId || !deviceToken || !date) {
      return handleErrorClient(res, 400, "Data insuficiente");
    }

    if (dayjs(date).isAfter(dayjs())) {
      return handleErrorClient(res, 400, "La fecha no puede ser mayor a hoy.");
    }

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

    if (!startDate || !endDate) {
      return handleErrorClient(res, 400, "Debe proporcionar fechas de inicio y fin.");
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const today = dayjs();

    if (!start.isValid() || !end.isValid()) {
      return handleErrorClient(res, 400, "Formato de fecha inválido.");
    }

    if (start.year() < 2025 || end.year() < 2025) {
      return handleErrorClient(res, 400, "El año mínimo permitido es 2025.");
    }

    if (start.isAfter(end)) {
      return handleErrorClient(res, 400, "La fecha de inicio no puede ser posterior a la fecha final.");
    }

    if (end.isAfter(today)) {
      return handleErrorClient(res, 400, "La fecha final no puede ser posterior al día de hoy.");
    }

    const [data, error] = await getUserAttendanceCounts(start.toISOString(), end.toISOString());

    if (error) return handleErrorServer(res, 500, error);

    handleSuccess(res, 200, "Datos obtenidos con éxito", data);
  } catch (err) {
    handleErrorServer(res, 500, err.message);
  }
}

export async function getAttendancesByUserId(req, res) {
  try {
    const { id } = req.params;

    const { error: paramsError } = userParamsValidation.validate({ id });

    if (paramsError) {
      return handleErrorClient(
        res,
        400,
        "Error en los parámetros enviados",
        paramsError.message
      );
    }

    const [attendances, error] = await getAttendancesByUserIdService({ id });

    if (error) {
      return handleErrorClient(res, 404, "Error al obtener asistencias", error);
    }

    handleSuccess(res, 200, "Asistencias del usuario obtenidas correctamente", attendances);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function createManualAttendance(req, res) {
  try {
    const { userId, date } = req.body;

    if (!userId || !date) {
      return handleErrorClient(res, 400, "Faltan campos obligatorios", "userId y date son requeridos");
    }

    const parsedDate = dayjs(date);
    if (!parsedDate.isValid()) {
      return handleErrorClient(res, 400, "Fecha inválida.");
    }

    if (parsedDate.isAfter(dayjs())) {
      return handleErrorClient(res, 400, "La fecha no puede ser mayor al día de hoy.");
    }

    const [attendance, error] = await createManualAttendanceService({ userId, date });

    if (error) {
      return handleErrorClient(res, 400, "No se pudo crear la asistencia", error);
    }

    return handleSuccess(res, 201, "Asistencia creada correctamente", attendance);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}

export async function deleteManualAttendance(req, res) {
  try {
    const { userId, date } = req.body;

    if (!userId || !date) {
      return handleErrorClient(res, 400, "Faltan campos obligatorios", "userId y date son requeridos");
    }

    const parsedDate = dayjs(date);
    if (!parsedDate.isValid()) {
      return handleErrorClient(res, 400, "Fecha inválida.");
    }

    if (parsedDate.isAfter(dayjs())) {
      return handleErrorClient(res, 400, "La fecha no puede ser mayor al día de hoy.");
    }

    const [attendance, error] = await deleteManualAttendanceService({ userId, date });

    if (error) {
      return handleErrorClient(res, 404, "No se pudo eliminar la asistencia", error);
    }

    return handleSuccess(res, 200, "Asistencia eliminada correctamente", attendance);
  } catch (error) {
    return handleErrorServer(res, 500, error.message);
  }
}