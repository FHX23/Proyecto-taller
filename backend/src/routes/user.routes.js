"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import {
  getUser,
  getUsers,
  updateUser,
  deactivateUser,
  deactivateUsers,
  activateUser,
  activateUsers
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isAdmin);

router
  .get("/getUser/:id", getUser)
  .get("/getUsers", getUsers)
  .put("/updateUser/:id", updateUser)
  .patch("/deactivateUser/:id", deactivateUser)
  .patch("/deactivateUsers", deactivateUsers)
  .patch("/activateUser/:id", activateUser)
  .patch("/activateUsers", activateUsers);
  
export default router;