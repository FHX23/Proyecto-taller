import { registerDeviceTokenService } from "../services/device.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function registerDeviceTokenController(req, res) {
  try {
    const userId = req.user?.id;
    const { deviceToken } = req.body;

    if (!userId || !deviceToken) {
      return handleErrorClient(res, 400, "No hay user o token");
    }

    const [result, error] = await registerDeviceTokenService({ userId, deviceToken });

    if (error) return handleErrorClient(res, 400, error);

    return handleSuccess(res, 201, "Token del dispositivo registrado", result);
  } catch (error) {
    console.error("Device register error:", err);
    return handleErrorServer(res, 500, error.message);
  }
}
