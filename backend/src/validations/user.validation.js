"use strict";
import Joi from "joi";

const domainEmailValidator = (value, helper) => {
  if (value === null || value === "") return value; // Permitir null o vacío (para eliminar email)
  if (!value.endsWith("@gmail.cl")) {
    return helper.message("El correo electrónico debe ser del dominio @gmail.cl");
  }
  return value;
};

export const userParamsValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id debe ser un numero",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
      "any.required": "El id es requerido",
    })
})

export const userBodyValidation = Joi.object({
  fullName: Joi.string() 
    .min(15)
    .max(255)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre completo no puede estar vacío.",
      "string.base": "El nombre completo debe ser de tipo string.",
      "string.min": "El nombre completo debe tener como mínimo 15 caracteres.",
      "string.max": "El nombre completo debe tener como máximo 255 caracteres.",
      "string.pattern.base": "El nombre completo solo puede contener letras y espacios.",
    }),

  email: Joi.string()
    .min(5)
    .max(255)
    .email()
    .allow(null)
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe ser un email válido.",
      "string.min": "El correo electrónico debe tener como mínimo 5 caracteres.",
      "string.max": "El correo electrónico debe tener como máximo 255 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),

  password: Joi.string()
    .min(8)
    .max(26)
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo texto.",
      "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
      "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La contraseña solo puede contener letras y números.",
    }),

  newPassword: Joi.string()
    .min(8)
    .max(26)
    .allow("")
    .pattern(/^[a-zA-Z0-9]+$/)
    .messages({
      "string.empty": "La nueva contraseña no puede estar vacía.",
      "string.base": "La nueva contraseña debe ser de tipo texto.",
      "string.min": "La nueva contraseña debe tener como mínimo 8 caracteres.",
      "string.max": "La nueva contraseña debe tener como máximo 26 caracteres.",
      "string.pattern.base": "La nueva contraseña solo puede contener letras y números.",
    }),

  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),

  role: Joi.string()
    .valid("administrador", "usuario")
    .messages({
      "any.only": "El rol debe ser 'administrador' o 'usuario'.",
      "string.base": "El rol debe ser de tipo string.",
    }),

  paymentType: Joi.string()
    .valid("transferencia", "efectivo")
    .messages({
      "any.only": "El tipo de pago debe ser 'transferencia' o 'efectivo'.",
    }),

  isActive: Joi.boolean()
    .messages({
      "boolean.base": "El campo 'activo' debe ser verdadero o falso.",
    }),

  isMinor: Joi.boolean()
    .messages({
      "boolean.base": "El campo 'menor de edad' debe ser verdadero o falso.",
    }),
})
  .or("fullName", "email", "password", "newPassword", "rut", "role", "paymentType", "isActive", "isMinor")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un campo para actualizar.",
  });

export const multipleUserIdsValidation = Joi.object({
  ids: Joi.array()
    .items(
      Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
          "number.base": "Cada id debe ser un número",
          "number.integer": "Cada id debe ser un número entero",
          "number.positive": "Cada id debe ser un número positivo",
          "any.required": "Cada id es requerido",
        })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Se requiere un array de IDs",
      "array.min": "Debe haber al menos un ID",
      "any.required": "El campo 'ids' es requerido",
    }),
});





  export const userQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  email: Joi.string()
    .min(15)
    .max(35)
    .email()
    .allow(null)
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.base": "El correo electrónico debe ser de tipo string.",
      "string.email": "El correo electrónico debe finalizar en @gmail.cl.",
      "string.min": "El correo electrónico debe tener como mínimo 15 caracteres.",
      "string.max": "El correo electrónico debe tener como máximo 35 caracteres.",
    })
    .custom(domainEmailValidator, "Validación dominio email"),
  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
})
  .or("id", "email", "rut")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id, email o rut.",
  });
