import cron from "node-cron";
import { createTodayWorkdayService } from "../services/workDay.service.js";

export async function runCreateTodayWorkdayOnStartup() {
  try {
    const [result, error] = await createTodayWorkdayService();
    if (error && result) {
      console.log("Día laboral ya existía:", result.date);
    } else if (error) {
      console.error("Error al verificar/crear el día laboral:", error);
    } else {
      console.log("Día laboral creado automáticamente:", result.date);
    }
  } catch (err) {
    console.error("Error crítico al crear día laboral:", err);
  }
}

export function scheduleDailyWorkdayJob() {
  cron.schedule("5 0 * * *", async () => {
    await runCreateTodayWorkdayOnStartup();
  });
}