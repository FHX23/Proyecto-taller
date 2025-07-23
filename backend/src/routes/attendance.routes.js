"use strict";
import { Router } from "express";
import { markAttendanceController , getAttendanceSummaryController} from "../controllers/attendance.controller.js"
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { createTodayWorkdayController } from "../controllers/workDay.controller.js";
const router = Router();

router
  .post("/markAttendance/:date", authenticateJWT,markAttendanceController)
  .get("/getAttendance",getAttendanceSummaryController)
export default router;