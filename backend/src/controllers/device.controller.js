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
      return handleErrorClient(res, 400, "Missing user or device token");
    }

    const [result, error] = await registerDeviceTokenService({ userId, deviceToken });

    if (error) return handleErrorClient(res, 400, error);

    return handleSuccess(res, 201, "Device token registered", result);
  } catch (err) {
    console.error("Device register error:", err);
    return handleErrorServer(res, 500, "Internal server error");
  }
}
