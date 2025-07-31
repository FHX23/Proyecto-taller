"use strict";
import {
  deleteUserService,
  getUserService,
  getUsersService,
  updateUserService,
} from "../services/user.service.js";
import {
  userBodyValidation,
  userQueryValidation,
  userParamsValidation
} from "../validations/user.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    const { error } = userParamsValidation.validate({ id }, { abortEarly: false });

    if (error) {
      const messages = error.details.map((e) => e.message);
      return handleErrorClient(res, 400, messages);
    }

    const [user, userError] = await getUserService({ id });

    if (userError) return handleErrorClient(res, 404, userError);

    handleSuccess(res, 200, "Usuario encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getUsers(req, res) {
  try {
    const [users, errorUsers] = await getUsersService();

    if (errorUsers) return handleErrorClient(res, 404, errorUsers);

    users.length === 0
      ? handleSuccess(res, 204)
      : handleSuccess(res, 200, "Usuarios encontrados", users);
  } catch (error) {
    handleErrorServer(
      res,
      500,
      error.message,
    );
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { body } = req;

    const { error: paramsError } = userParamsValidation.validate(
      { id },
      { abortEarly: false }
    );

    if (paramsError) {
      const messages = paramsError.details.map((e) => e.message);
      return handleErrorClient(res,
        400,
        "Error en el Params enviado",
        messages);
    }

    const { error: bodyError } = userBodyValidation.validate(body, {
      abortEarly: false,
    });

    if (bodyError) {
      const messages = bodyError.details.map((e) => e.message);
      return handleErrorClient(
        res,
        400,
        "Error de validación en los datos enviados",
        messages
      );
    }

    const [user, userError] = await updateUserService({ id }, body);

    if (userError) {
      return handleErrorClient(
        res,
        400,
        "Error modificando al usuario",
        userError
      );
    }

    handleSuccess(res, 200, "Usuario modificado correctamente", user);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deactivateUser(req, res) {
  try {
    const { id } = req.params;

    const { error: paramsError } = userParamsValidation.validate({ id });

    if (paramsError) {
      return handleErrorClient(
        res,
        400,
        "Error en el Params enviado",
        paramsError.message,
      );
    }

    const [userDelete, errorUserDelete] = await deleteUserService({ id });

    if (errorUserDelete) {
      return handleErrorClient(res, 404, "Error al desactivar el usuario", errorUserDelete);
    }

    handleSuccess(res, 200, "Usuario desactivado correctamente", userDelete);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}