"use strict";

import User from "../entity/user.entity.js";
import Workday from "../entity/workDay.entity.js";
import Attendance from "../entity/attendance.entity.js";
import { AppDataSource } from "./config.Db.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

// Extender Dayjs con los plugins necesarios
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// --- DATOS DE EJEMPLO PARA USUARIOS ---
const sampleUsersData = [
    { fullName: "Ana García Pérez", rut: "19.876.543-2" },
    { fullName: "Luis Martínez Soto", rut: "18.765.432-1" },
    { fullName: "Sofía Rodríguez López", rut: "20.123.456-7" },
    { fullName: "Carlos Fernández Díaz", rut: "17.654.321-0" },
    { fullName: "Elena Gómez Morales", rut: "21.543.210-9" },
    { fullName: "Javier Moreno Jiménez", rut: "16.432.109-8" },
    { fullName: "Laura Alonso Ruiz", rut: "22.321.098-7" },
    { fullName: "David Muñoz Sánchez", rut: "15.210.987-6" },
    { fullName: "Isabel Romero Castro", rut: "23.456.789-K" },
    { fullName: "Miguel Torres Navarro", rut: "14.098.765-4" },
    { fullName: "Lucía Gil Ramos", rut: "24.567.890-1" },
    { fullName: "Pablo Cano Vega", rut: "13.987.654-3" },
    { fullName: "Marta Flores Castillo", rut: "25.678.901-2" },
    { fullName: "Adrián Campos Ortega", rut: "12.876.543-1" },
    { fullName: "Sara Reyes Medina", rut: "26.789.012-3" },
    { fullName: "Sergio Molina Delgado", rut: "11.765.432-0" },
    { fullName: "Paula Prieto Cruz", rut: "27.890.123-4" },
    { fullName: "Diego Santos Ibáñez", rut: "10.654.321-K" },
    { fullName: "Cristina Pascual Garrido", rut: "28.901.234-5" },
    { fullName: "Marcos Herrera Mendoza", rut: "9.543.210-8" },
];

/**
 * @function createUsers
 * @description Crea un usuario administrador y un conjunto de usuarios regulares si no existen en la BD.
 */
async function createUsers() {
    console.log("--- Iniciando creación de usuarios ---");
    const userRepository = AppDataSource.getRepository(User);

    // 1. Verificar si ya existen usuarios para no duplicar
    const count = await userRepository.count();
    if (count > 0) {
        console.log("Los usuarios ya existen en la base de datos. Omitiendo creación.");
        return;
    }

    try {
        // 2. Crear usuario Administrador
        const adminPassword = await encryptPassword("admin1234");
        const admin = userRepository.create({
            fullName: "Administrador Principal",
            rut: "11.111.111-1",
            email: "administrador@gmail.cl", // CORREO CORREGIDO
            password: adminPassword,
            role: "administrador",
            paymentType: "transferencia",
            isActive: true,
            isMinor: false,
        });

        // 3. Crear usuarios regulares
        const userPassword = await encryptPassword("user1234");
        const usersToCreate = sampleUsersData.map((userData, index) => {
            return userRepository.create({
                ...userData,
                email: `usuario${index + 1}@gmail.com`, // DOMINIO CORREGIDO
                password: userPassword,
                role: "usuario",
                paymentType: "transferencia",
                isActive: true,
                isMinor: false,
            });
        });

        // 4. Guardar todos los usuarios en la base de datos
        await userRepository.save([admin, ...usersToCreate]);
        console.log(`✅ Se han creado con éxito 1 administrador y ${usersToCreate.length} usuarios.`);

    } catch (error) {
        console.error("❌ Error al crear los usuarios:", error);
    }
}

/**
 * @function createPastWorkdays
 * @description Crea registros de Workday para los últimos 90 días.
 */
async function createPastWorkdays() {
    console.log("\n--- Iniciando creación de días laborales (Workdays) ---");
    const workdayRepository = AppDataSource.getRepository(Workday);

    const count = await workdayRepository.count();
    if (count > 0) {
        console.log("Los Workdays ya existen. Omitiendo creación.");
        return;
    }

    const timeZone = "America/Santiago";
    const today = dayjs().tz(timeZone);
    const workdaysToCreate = [];
    const defaultPayAmount = 20000;

    for (let i = 0; i < 90; i++) {
        const date = today.subtract(i, 'day');
        const dayOfWeek = date.day(); // 0 = Domingo, 6 = Sábado

        const isWorkingDay = dayOfWeek !== 0 && dayOfWeek !== 6;

        const newWorkday = workdayRepository.create({
            date: date.format("YYYY-MM-DD"),
            isWorkingDay: isWorkingDay,
            payAmount: isWorkingDay ? defaultPayAmount : null,
            comment: isWorkingDay ? "Día laboral regular" : "Fin de semana",
        });
        workdaysToCreate.push(newWorkday);
    }

    try {
        await workdayRepository.save(workdaysToCreate);
        console.log(`✅ Se han creado con éxito ${workdaysToCreate.length} registros de Workday.`);
    } catch (error) {
        console.error("❌ Error al crear los Workdays:", error);
    }
}

/**
 * @function createAttendances
 * @description Crea registros de asistencia para los usuarios en los días laborales existentes.
 */
async function createAttendances() {
    console.log("\n--- Iniciando creación de asistencias ---");
    const attendanceRepository = AppDataSource.getRepository(Attendance);
    const userRepository = AppDataSource.getRepository(User);
    const workdayRepository = AppDataSource.getRepository(Workday);

    const count = await attendanceRepository.count();
    if (count > 0) {
        console.log("Las asistencias ya existen. Omitiendo creación.");
        return;
    }

    try {
        const users = await userRepository.find({ where: { role: 'usuario' } });
        const workingDays = await workdayRepository.find({ where: { isWorkingDay: true } });

        if (users.length === 0 || workingDays.length === 0) {
            console.log("No hay usuarios o días laborales para crear asistencias.");
            return;
        }

        const attendancesToCreate = [];
        const attendanceChance = 0.85; // 85% de probabilidad de que un usuario asista

        for (const user of users) {
            for (const workday of workingDays) {
                if (Math.random() < attendanceChance) {
                    const newAttendance = attendanceRepository.create({
                        user: user,
                        workday: workday,
                    });
                    attendancesToCreate.push(newAttendance);
                }
            }
        }

        await attendanceRepository.save(attendancesToCreate);
        console.log(`✅ Se han creado con éxito ${attendancesToCreate.length} registros de asistencia.`);

    } catch (error) {
        console.error("❌ Error al crear las asistencias:", error);
        if (error.message.includes("duplicate key value violates unique constraint")) {
            console.error("Detalle: Posiblemente se intentó insertar una asistencia duplicada (mismo usuario en el mismo día).");
        }
    }
}


/**
 * @function initialSetup
 * @description Función principal que orquesta toda la configuración inicial de la base de datos.
 */
export async function initialSetup() {
    console.log("🚀 Iniciando configuración inicial de la base de datos...");

    try {
        await createUsers();
        await createPastWorkdays();
        await createAttendances();

        console.log("\n🎉 Configuración inicial completada con éxito.");
    } catch (error) {
        console.error("❌ Ha ocurrido un error catastrófico durante la configuración inicial:", error);
    }
}
