import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { registerDeviceTokenController } from "../controllers/device.controller.js";

const router = Router();

router.post("/register", authenticateJWT, registerDeviceTokenController);

export default router;