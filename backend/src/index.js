"use strict";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import indexRoutes from "./routes/index.routes.js";
import session from "express-session";
import passport from "passport";
import express, { json, urlencoded } from "express";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/config.Db.js";
import { initialSetup } from "./config/initialSetup.js"; // <- CAMBIO AQUÍ
import { passportJwtSetup } from "./auth/passport.auth.js";
import {
  scheduleDailyWorkdayJob,
  runCreateTodayWorkdayOnStartup,
} from "./jobs/createTodayWorkdayJob.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    app.use(
      cors({
        credentials: true,
        origin: true,
      }),
    );

    app.use(
      urlencoded({
        extended: true,
        limit: "1mb",
      }),
    );

    app.use(
      json({
        limit: "1mb",
      }),
    );

    app.use(cookieParser());

    app.use(morgan("dev"));

    app.use(
      session({
        secret: cookieKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        },
      }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passportJwtSetup();

    app.use("/api", indexRoutes);

    app.listen(PORT, () => {
      console.log(`Server corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js en setupServer(), el error es: ", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();
    await initialSetup(); // <- Y CAMBIO AQUÍ
    await runCreateTodayWorkdayOnStartup();
    scheduleDailyWorkdayJob();
    const todayDateOnly = dayjs().tz("America/Santiago").format("YYYY-MM-DD");
    console.log("Fecha detectada:", todayDateOnly);
  } catch (error) {
    console.log("Error: ", error);
  }
}

setupAPI()
  .then(() => console.log("A P I inicio"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );