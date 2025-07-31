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

export async function getUserAttendanceCounts(startDate, endDate) {
  try {
    const result = await AppDataSource
      .getRepository(Attendance)
      .createQueryBuilder("attendance")
      .innerJoin("attendance.user", "user")
      .innerJoin("attendance.workday", "workday")
      .select("user.fullName", "fullName")
      .addSelect("user.rut", "rut")
      .addSelect("COUNT(attendance.id)", "attendanceCount")
      .where("workday.date BETWEEN :startDate AND :endDate", { startDate, endDate })
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

export async function getAttendancesByUserIdService({ id }) {
  try {
    const attendanceRepository = AppDataSource.getRepository("Attendance");

    const attendances = await attendanceRepository.find({
      where: { user: { id } },
      relations: ["workday", "device", "user"],
      order: {
        createdAt: "DESC",
      },
    });

    return [attendances, null];
  } catch (error) {
    console.error("Error al obtener asistencias del usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createManualAttendanceService({ userId, date }) {
  try {
    const attendanceRepo = AppDataSource.getRepository("Attendance");
    const workdayRepo = AppDataSource.getRepository("Workday");

    const workday = await workdayRepo.findOne({ where: { date } });

    if (!workday) {
      return [null, "No existe un Workday para esa fecha"];
    }

    const existingAttendance = await attendanceRepo.findOne({
      where: {
        user: { id: userId },
        workday: { id: workday.id },
      },
    });

    if (existingAttendance) {
      return [null, "La asistencia ya existe para ese usuario y día"];
    }

    const attendance = attendanceRepo.create({
      user: { id: userId },
      workday: { id: workday.id },
    });

    await attendanceRepo.save(attendance);

    return [attendance, null];
  } catch (error) {
    console.error("Error al crear asistencia manual:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteManualAttendanceService({ userId, date }) {
  try {
    const attendanceRepo = AppDataSource.getRepository("Attendance");
    const workdayRepo = AppDataSource.getRepository("Workday");

    const workday = await workdayRepo.findOne({ where: { date } });

    if (!workday) {
      return [null, "No existe un Workday para esa fecha"];
    }

    const attendance = await attendanceRepo.findOne({
      where: {
        user: { id: userId },
        workday: { id: workday.id },
      },
    });

    if (!attendance) {
      return [null, "No existe una asistencia para ese usuario en ese día"];
    }

    await attendanceRepo.remove(attendance);

    return [attendance, null];
  } catch (error) {
    console.error("Error al eliminar asistencia manual:", error);
    return [null, "Error interno del servidor"];
  }
}