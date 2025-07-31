"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/config.Db.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";

export async function getUserService({ id }) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { id },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find();

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ password, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService({ id }, body) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { id },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const userWithSameRut = await userRepository.findOne({
      where: { rut: body.rut },
    });
    if (userWithSameRut && userWithSameRut.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo RUT"];
    }

    const userWithSameEmail = await userRepository.findOne({
      where: { email: body.email },
    });
    if (userWithSameEmail && userWithSameEmail.id !== userFound.id) {
      return [null, "Ya existe un usuario con el mismo email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(
        body.password,
        userFound.password,
      );
      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataUserUpdate = {
      fullName: body.fullName,
      rut: body.rut,
      email: body.email,
      role: body.role,
      paymentType: body.paymentType,
      isActive: body.isActive,
      isMinor: body.isMinor,
      updatedAt: new Date(),
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    await userRepository.update({ id: userFound.id }, dataUserUpdate);

    const userData = await userRepository.findOne({
      where: { id: userFound.id },
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deactivateUserService({ id }) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { id },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.role === "administrador") {
      return [null, "No se puede desactivar un usuario con rol de administrador"];
    }

    await userRepository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });

    const userUpdated = await userRepository.findOne({
      where: { id },
    });

    if (!userUpdated) {
      return [null, "Usuario no encontrado después de desactivar"];
    }

    const { password, ...dataUser } = userUpdated;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al desactivar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}
