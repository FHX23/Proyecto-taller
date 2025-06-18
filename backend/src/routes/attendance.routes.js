"use strict";
import { Router } from "express";
import { markAttendanceController } from "../controllers/attendance.controller.js"
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .post("/markAttendance/:date", authenticateJWT,markAttendanceController);

export default router;