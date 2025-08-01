"use client";

import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ScanQrCode } from "lucide-react";

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-center gap-2 p-8 lg:px-6">
        <ScanQrCode className="h-8 w-8" />
        <Link to="/" className="text-2xl font-bold text-green-500">
          ScanWorks
        </Link>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center">
        <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-green-900">
          Gestión de Asistencia con QR
        </h1>
        <p className="text-xl mb-8 text-slate-700 dark:text-green-600 max-w-xl">
          Controla entradas y salidas mediante escaneo de códigos QR. Rápido, simple y eficiente.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Link
            to="/login"
            className="inline-flex justify-center items-center py-3 px-4 text-base font-medium text-white rounded-lg bg-yellow-700 hover:bg-green-700"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="inline-flex justify-center items-center py-3 px-4 text-base font-medium text-white rounded-lg bg-green-600 hover:bg-green-700"
          >
            Crear Cuenta
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Landing;