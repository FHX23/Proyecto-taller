"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import attendanceRoutes from "./attendance.routes.js"
import qrRoutes from "./qr.routes.js"
import deviceRoutes from "./device.routes.js"

const router = Router();

router
    .use("/auth", authRoutes)
    .use("/user", userRoutes)
    .use("/attendance",attendanceRoutes)
    .use("/qr",qrRoutes)
    .use("/device", deviceRoutes);
    
export default router;