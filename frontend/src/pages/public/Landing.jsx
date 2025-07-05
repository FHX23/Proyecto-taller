"use client";

import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-center gap-2 p-8 lg:px-6">
        <Link to="/" className="text-2xl font-bold text-green-500">
          ScanWork
        </Link>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
          Gestión de Asistencia con QR
        </h1>
        <p className="text-xl mb-8 text-slate-700 dark:text-slate-300 max-w-xl">
          Controla entradas y salidas mediante escaneo de códigos QR. Rápido, simple y eficiente.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Link
            to="/login"
            className="inline-flex justify-center items-center py-3 px-4 text-base font-medium text-white rounded-lg bg-green-500 hover:bg-green-700"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium border rounded-lg border-gray-300 text-gray-900 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Crear Cuenta
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}