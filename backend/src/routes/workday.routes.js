"use strict";
import { Router } from "express";
import { createManualWorkdayController } from "../controllers/workDay.controller.js";
import { createTodayWorkdayController } from "../controllers/workDay.controller.js";
import { getAllWorkdaysController } from "../controllers/workDay.controller.js";
import { updateWorkday } from "../controllers/workDay.controller.js";
const router = Router();

router
  .post("/createToday", createTodayWorkdayController)
  .post("/createManual", createManualWorkdayController)
  .get("/getAll", getAllWorkdaysController)
  .patch("/updateWorkday", updateWorkday);
  
export default router;