import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/auth.service.js";
import useLogin from "@/hooks/auth/useLogin.jsx";
import Footer from "@/components/layout/Footer";

// --- TOAST DESACTIVADO ---
// import { ToastAction } from "@/components/ui/toast";
// import { useToast } from "@/hooks/use-toast";

import { School } from "lucide-react";
import Form from "@/components/layout/Form";

const Login = () => {
  const navigate = useNavigate();

  // --- TOAST DESACTIVADO ---
  // const { toast } = useToast();

  const { errorEmail, errorPassword, errorData, handleInputChange } =
    useLogin();

  const loginSubmit = async (data) => {
    try {
      const response = await login(data);
      if (response.status === "Success") {
        // --- TOAST DESACTIVADO ---
        // toast({
        //   title: "Inicio de sesión exitoso",
        //   description: "Has iniciado sesión exitosamente",
        // });

        navigate("/home");
      } else if (response.status === "Client error") {
        errorData(response.details);

        // --- TOAST DESACTIVADO ---
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "Hubo un problema al iniciar sesión",
        //   status: "error",
        //   action: (
        //     <ToastAction
        //       altText="Crear Cuenta"
        //       onClick={() => navigate("/register")}
        //     >
        //       Crear Cuenta
        //     </ToastAction>
        //   ),
        // });
      }
    } catch (error) {
      console.log(error);

      // --- TOAST DESACTIVADO ---
      // toast({
      //   variant: "destructive",
      //   title: "Error del servidor",
      //   description: "No se pudo conectar con el servidor, intenta más tarde.",
      // });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-center gap-2 p-8 lg:px-6">
        <div className="flex justify-center items-center gap-2">
          <School className="h-8 w-8" />
          <Link to="/" className="text-xl font-bold">
            MiLiceo
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        <div className="flex min-h-full items-center justify-center p-8">
          <div className="max-w-md w-full space-y-6 bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
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
