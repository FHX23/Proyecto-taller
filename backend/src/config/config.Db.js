"use strict";
import { DataSource } from "typeorm";
// CAMBIO: Importamos los nombres de variables correctos
import {
  DATABASE_URL,
  POSTGRES_DB,
  POSTGRES_USER,
  HOST,
  POSTGRES_PASSWORD,
} from "./configEnv.js";

// La lógica para elegir entre DATABASE_URL o credenciales individuales no cambia
export const AppDataSource = new DataSource(
  DATABASE_URL
    ? {
        type: "postgres",
        url: DATABASE_URL,
        entities: ["src/entity/**/*.js"],
        synchronize: true,
        logging: false,
      }
    : {
        type: "postgres",
        host: HOST,
        port: 5432,
        // CAMBIO: Usamos las variables importadas con los nombres correctos
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        entities: ["src/entity/**/*.js"],
        synchronize: true,
        logging: false,
      }
);

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conexión exitosa a la base de datos.");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}



/*
"use strict";
import { DataSource } from "typeorm";
import { DATABASE_URL, DATABASE, DB_USERNAME, HOST, PASSWORD } from "./configEnv.js";

// Definir AppDataSource según si existe DATABASE_URL o no
export const AppDataSource = new DataSource(
  DATABASE_URL
    ? {
        type: "postgres",
        url: DATABASE_URL,
        
        entities: ["src/entity/**/
        //*.js"],quitar //
        /*
        synchronize: true,
        logging: false,
      }
    : {
        type: "postgres",
        host: HOST,
        port: 5432,
        username: DB_USERNAME,
        password: PASSWORD,
        database: DATABASE,
        entities: ["src/entity/**/
        //*.js"], quitar //
        /*synchronize: true,
        logging: false,
      }
);

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("se conecto a la base de datos");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
  */
