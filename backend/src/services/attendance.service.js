import Attendance from "../entity/attendance.entity.js";
import DeviceAssignment from "../entity/deviceAssignment.entity.js";
import { AppDataSource } from "../config/config.Db.js";

export async function markAttendanceService({ userId, deviceToken, latitude, longitude, ipAddress, date }) {
  try {
    const attendanceRepo = AppDataSource.getRepository(Attendance);
    const deviceRepo = AppDataSource.getRepository(DeviceAssignment);

    // Check if already marked today
    const alreadyMarked = await attendanceRepo.findOne({
      where: {
        user: { id: userId },
        date,
      },
    });

    if (alreadyMarked) return [null, "Attendance already marked for today"];

    // Validate if token is linked to another user
    const existingToken = await deviceRepo.findOne({ where: { deviceToken } });

    if (existingToken && existingToken.user.id !== userId)
      return [null, "This device is already assigned to another user"];

    // Register the device if token not found
    if (!existingToken) {
      await deviceRepo.insert({ user: { id: userId }, deviceToken });
    }

    // Save attendance
    const newAttendance = attendanceRepo.create({
      user: { id: userId },
      date,
      latitude,
      longitude,
      ipAddress,
    });

    await attendanceRepo.save(newAttendance);

    return [newAttendance, null];
  } catch (error) {
    console.error("Attendance marking error:", error);
    return [null, "Internal server error while marking attendance"];
  }
}