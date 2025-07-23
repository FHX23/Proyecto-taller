import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

import { createTodayWorkdayService } from "../services/workDay.service.js";
import { createManualWorkdayService } from "../services/workDay.service.js";
import { getAllWorkdaysService } from "../services/workDay.service.js";
export async function createTodayWorkdayController(req, res) {
  try {
    const [result, error] = await createTodayWorkdayService();

    if (error && result)
      return handleSuccess(res, 200, error, result); // Ya existe pero lo retornamos

    if (error)
      return handleErrorClient(res, 400, error); // Otro tipo de error

    handleSuccess(res, 201, "Día laboral creado correctamente", result);
  } catch (err) {
    handleErrorServer(res, 500, err.message);
  }
}

export async function createManualWorkdayController(req, res) {
  try {
    const { date, isWorkingDay, payAmount, comment } = req.body;

    const [result, error] = await createManualWorkdayService({
      date,
      isWorkingDay,
      payAmount,
      comment,
    });

    if (error) return handleErrorClient(res, 400, error);

    handleSuccess(res, 201, "Día laboral creado manualmente", result);
  } catch (err) {
    handleErrorServer(res, 500, err.message);
  }
}

export async function getAllWorkdaysController(req, res) {
  try {
    const [result, error] = await getAllWorkdaysService();
    if (error) return handleErrorServer(res, 500, error);
    handleSuccess(res, 200, "Workdays obtenidos exitosamente", result);
  } catch (err) {
    handleErrorServer(res, 500, err.message);
  }
}