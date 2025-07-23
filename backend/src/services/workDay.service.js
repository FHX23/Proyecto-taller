import Workday from "../entity/workDay.entity.js";
import { AppDataSource } from "../config/config.Db.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function createTodayWorkdayService() {
  try {
    const workdayRepo = AppDataSource.getRepository(Workday);
    
    const todayDateOnly = dayjs().tz("America/Santiago").format("YYYY-MM-DD");

    // Verificar si ya existe un workday para hoy
    const existing = await workdayRepo.findOne({
      where: { date: todayDateOnly },
    });

    if (existing) return [existing, "El día laboral de hoy ya existe"];

    // Crear nuevo día laboral
    const newWorkday = workdayRepo.create({
      date: todayDateOnly,
      isWorkingDay: true,
    });

    await workdayRepo.save(newWorkday);

    return [newWorkday, null];
  } catch (error) {
    console.error("Error creando día laboral:", error.stack);
    return [null, "Error interno al crear el día laboral"];
  }
}