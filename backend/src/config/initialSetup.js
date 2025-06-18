"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Saul Muñon",
          rut: "21.308.770-3",
          email: "administrador@gmail.cl",
          password: await encryptPassword("admin123"),
          rol: "administrador",
          tipoPago: "transferencia",
          isActive: true,
          isMinor: false,
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Victor Cabero Rios",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user123"),
          rol: "usuario",
          tipoPago: "transferencia",
          isActive: true,
          isMinor: false,
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Estevan brabo",
          rut: "20.630.735-8",
          email: "usuario2.2024@gmail.cl",
          password: await encryptPassword("user123"),
          rol: "usuario",
          tipoPago: "transferencia",
          isActive: true,
          isMinor: true,
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Vastian Arriagada",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1233"),
          rol: "usuario",
          tipoPago: "transferencia",
          isActive: true,
          isMinor: false,
        }),
      ),
    ]);
    console.log("Usuarios creados");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };
