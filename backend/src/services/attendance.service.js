import Attendance from "../entity/attendance.entity.js";
import DeviceAssignment from "../entity/deviceAssignment.entity.js";
import { AppDataSource } from "../config/config.Db.js";
import User from "../entity/user.entity.js";
import Workday from "../entity/workDay.entity.js";

export async function markAttendanceService({
  userId,
  deviceToken,
  latitude,
  longitude,
  ipAddress,
  date,
}) {
  try {
    const attendanceRepo = AppDataSource.getRepository(Attendance);
    const deviceRepo = AppDataSource.getRepository(DeviceAssignment);
    const workdayRepo = AppDataSource.getRepository(Workday);

    // 1. Buscar el Workday correspondiente a la fecha
    const workday = await workdayRepo.findOne({ where: { date } });
    if (!workday) return [null, "No hay un día laboral registrado para esa fecha"];

    // 2. Revisar si ya marcó asistencia ese día
    const alreadyMarked = await attendanceRepo.findOne({
      where: {
        user: { id: userId },
        workday: { id: workday.id },
      },
    });

    if (alreadyMarked) return [null, "Asistencia ya registrada para ese día"];

    // 3. Validar dispositivo
    const existingToken = await deviceRepo.findOne({
      where: { deviceToken },
      relations: ["user"],
    });

    if (existingToken && existingToken.user.id !== userId) {
      return [null, "Este dispositivo ya está asignado a otro usuario"];
    }

    // 4. Registrar el dispositivo si es nuevo
    if (!existingToken) {
      await deviceRepo.insert({ user: { id: userId }, deviceToken });
    }

    // 5. Guardar la asistencia
    const newAttendance = attendanceRepo.create({
      user: { id: userId },
      workday: { id: workday.id },
      device: existingToken ? { id: existingToken.id } : undefined,
      latitude,
      longitude,
      ipAddress,
    });

    await attendanceRepo.save(newAttendance);

    return [newAttendance, null];
  } catch (error) {
    console.error("Attendance marking error:", error.stack);
    return [null, "Internal server error while marking attendance"];
  }
}

export async function getUserAttendanceCounts() {
  try {
    const result = await AppDataSource
      .getRepository(Attendance)
      .createQueryBuilder("attendance")
      .select("user.fullName", "fullName")
      .addSelect("user.rut", "rut")
      .addSelect("COUNT(attendance.id)", "attendanceCount")
      .innerJoin("attendance.user", "user")
      .groupBy("user.id")
      .addGroupBy("user.fullName")
      .addGroupBy("user.rut")
      .getRawMany();

    return [result, null];
  } catch (error) {
    console.error("Error getting attendance counts:", error);
    return [null, "Error retrieving attendance summary"];
  }
}