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
    console.log("Inicio de markAttendanceService");
    const attendanceRepo = AppDataSource.getRepository(Attendance);
    const deviceRepo = AppDataSource.getRepository(DeviceAssignment);
    const workdayRepo = AppDataSource.getRepository(Workday);

    // 1. Buscar el Workday correspondiente a la fecha
    console.log("Buscando workday para la fecha:", date);
    const workday = await workdayRepo.findOne({ where: { date } });
    if (!workday) {
      console.log("No hay un día laboral registrado para esa fecha");
      return [null, "No hay un día laboral registrado para esa fecha"];
    }
    console.log("Workday encontrado:", workday);

    // 2. Revisar si ya marcó asistencia ese día
    console.log(`Verificando si usuario ${userId} ya marcó asistencia para workday ${workday.id}`);
    const alreadyMarked = await attendanceRepo.findOne({
      where: {
        user: { id: userId },
        workday: { id: workday.id },
      },
    });

    if (alreadyMarked) {
      console.log("Asistencia ya registrada para ese día");
      return [null, "Asistencia ya registrada para ese día"];
    }
    console.log("No hay registro previo de asistencia para este usuario y fecha");

    // 3. Validar dispositivo
    console.log("Buscando dispositivo con token:", deviceToken);
    const existingToken = await deviceRepo.findOne({
      where: { deviceToken },
      relations: ["user"],
    });

    if (existingToken) {
      console.log("Dispositivo encontrado:", existingToken);
      if (existingToken.user.id !== userId) {
        console.log("Dispositivo asignado a otro usuario:", existingToken.user.id);
        return [null, "Este dispositivo ya está asignado a otro usuario"];
      }
      console.log("Dispositivo corresponde al usuario");
    } else {
      console.log("Dispositivo no registrado aún");
    }

    // 4. Registrar el dispositivo si es nuevo
    /*
    if (!existingToken) {
      console.log("Insertando nuevo dispositivo para usuario:", userId);
      await deviceRepo.insert({ user: { id: userId }, deviceToken });
    }
    */

    // 5. Guardar la asistencia
    console.log("Creando registro de asistencia...");
    const newAttendance = attendanceRepo.create({
      user: { id: userId },
      workday: { id: workday.id },
      device: existingToken ? { id: existingToken.id } : undefined,
      latitude,
      longitude,
      ipAddress,
    });

    await attendanceRepo.save(newAttendance);
    console.log("Asistencia marcada con éxito:", newAttendance);
    return [newAttendance, null];
  } catch (error) {
    console.error("Error al marcar asistencia:", error.stack);
    return [null, "Error interno del servidor en marcar asistencia"];
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
    console.error("Error al obtener lista asistencia:", error);
    return [null, "Error interno del servidor al obtener lista asistencia"];
  }
}