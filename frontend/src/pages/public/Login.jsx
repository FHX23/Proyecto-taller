import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/auth.service.js";
import useLogin from "@/hooks/auth/useLogin.jsx";
import Footer from "@/components/layout/Footer";
import { ScanQrCode } from "lucide-react";
import Form from "@/components/layout/Form";
import { toast } from "sonner"; 

const Login = () => {
  const navigate = useNavigate();
  const { errorEmail, errorPassword, errorData, handleInputChange } = useLogin();

  const loginSubmit = async (data) => {
    try {
    const response = await login(data); 
    toast.success("Inicio de sesión exitoso");
    navigate("/home");
    
  } catch (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || "Error interno del servidor.";

    toast.error(errorMessage);
  }
};

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-center gap-2 p-8 lg:px-6">
        <div className="flex justify-center items-center gap-2">
          <ScanQrCode className="h-8 w-8" />
          <Link to="/" className="text-xl font-bold">
            Scanwork
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        <div className="flex min-h-full items-center justify-center p-8">
          <div className="max-w-md w-full space-y-6 bg-gray-50 dark:bg-gray-500 p-8 rounded-lg">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Inicia sesión para comenzar a usar la aplicación ScanWork.
              </p>
            </div>
            <Form
              title="Iniciar sesión"
              fields={[
                {
                  label: "Correo electrónico",
                  name: "email",
                  placeholder: "tonystark@gmail.cl",
                  type: "email",
                  required: true,
                },
                {
                  label: "Contraseña",
                  name: "password",
                  placeholder: "**********",
                  type: "password",
                  required: true,
                },
              ]}
              buttonText="Iniciar sesión"
              onSubmit={loginSubmit}
              footerContent={
                <div className="flex items-center justify-between">
                  <span>¿No tienes una cuenta?</span>
                  <Link to="/register" className="underline">
                    Crear Cuenta
                  </Link>
                </div>
              }
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
