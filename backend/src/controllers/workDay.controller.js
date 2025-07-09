import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

import { createTodayWorkdayService } from "../services/workDay.service.js";

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