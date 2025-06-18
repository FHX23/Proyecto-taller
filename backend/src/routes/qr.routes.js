"use strict";
import { Router } from "express";
import { generateDailyQRController } from "../controllers/QrGenerator.controller.js";

const router = Router();

router
  .get("/dailyQr", generateDailyQRController);

export default router;