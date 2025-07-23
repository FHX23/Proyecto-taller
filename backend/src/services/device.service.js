import DeviceAssignment from "../entity/deviceAssignment.entity.js";
import { AppDataSource } from "../config/config.Db.js";

export async function registerDeviceTokenService({ userId, deviceToken }) {
  try {
    const deviceRepo = AppDataSource.getRepository(DeviceAssignment);

    const existing = await deviceRepo.findOne({
      where: { deviceToken },
      relations: { user: true },
    });

    // Ya está registrado por otro usuario
    if (existing && existing.user.id !== userId) {
      return [null, "Este dispositivo ya esta registrado en otro usuario"];
    }

    // Ya está asignado a este usuario
    if (existing && existing.user.id === userId) {
      return [existing, null];
    }

    // No existe aún, lo registramos
    const newDevice = deviceRepo.create({
      deviceToken,
      user: { id: userId },
    });

    await deviceRepo.save(newDevice);

    return [newDevice, null];
  } catch (err) {
    console.error("Error al registrar dispositivo:", err);
    return [null, "Error interno del servidor al registrar dispositivo:"];
  }
}