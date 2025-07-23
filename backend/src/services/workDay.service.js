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

export async function createManualWorkdayService({ date, isWorkingDay, payAmount, comment }) {
  try {
    const workdayRepo = AppDataSource.getRepository(Workday);

    const existing = await workdayRepo.findOne({ where: { date } });
    if (existing) return [null, "Ya existe un Workday para esa fecha."];

    const newWorkday = workdayRepo.create({
      date,
      isWorkingDay,
      payAmount: isWorkingDay ? payAmount : null,
      comment,
    });

    await workdayRepo.save(newWorkday);
    return [newWorkday, null];
  } catch (err) {
    console.error("Error al crear día manual:", err.stack);
    return [null, "Error interno al crear el día laboral"];
  }
}

export async function getAllWorkdaysService() {
  try {
    const workdayRepo = AppDataSource.getRepository(Workday);
    const workdays = await workdayRepo.find({
      order: { date: "ASC" },
    });
    return [workdays, null];
  } catch (error) {
    console.error("Error al obtener workdays:", error.stack);
    return [null, "Error al obtener los días laborales"];
  }
}