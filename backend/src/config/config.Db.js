"use strict";
import { DataSource } from "typeorm";
import { DATABASE_URL, DATABASE, DB_USERNAME, HOST, PASSWORD } from "./configEnv.js";

// Definir AppDataSource según si existe DATABASE_URL o no
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
        username: DB_USERNAME,
        password: PASSWORD,
        database: DATABASE,
        entities: ["src/entity/**/*.js"],
        synchronize: true,
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
