import Workday from "../entity/workDay.entity.js";
import { AppDataSource } from "../config/config.Db.js";

export async function createTodayWorkdayService() {
  try {
    const workdayRepo = AppDataSource.getRepository(Workday);

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const today = new Date();
    const todayDateOnly = today.toISOString().split("T")[0]; // e.g., "2025-07-09"

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