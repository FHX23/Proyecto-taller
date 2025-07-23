"use strict";
import { Router } from "express";

import { createTodayWorkdayController } from "../controllers/workDay.controller.js";
const router = Router();

router
  .post("/createToday", createTodayWorkdayController);
export default router;