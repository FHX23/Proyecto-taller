import { Link, useNavigate } from "react-router-dom";
import { register } from "@/services/auth.service";
import useRegister from "@/hooks/auth/useLogin.jsx";
import Form from "@/components/layout/Form";
import { ScanQrCode } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { errorEmail, errorRut, errorData, handleInputChange } = useRegister();

  const registerSubmit = async (data) => {
    try {
      const response = await register(data);

      if (response.status === "Success") {
        toast.success("Cuenta creada exitosamente", {
          description: "Serás redirigido al login.",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } 
    } catch (err) {
      console.error("Error al registrar un usuario: ", err);

        /*toast.custom(() => (
  <div className="bg-gray-100 border border-gray-200 rounded-md p-4 shadow-sm max-w-md w-full text-gray-900">
    <strong className="block mb-1">Hubo un problema al crear la cuenta</strong>
    <p className="text-sm text-black">{err}</p>
  </div>
)); */

  toast.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-center gap-2 p-8 lg:px-6">
        <div className="flex justify-center items-center gap-2">
          <ScanQrCode className="h-8 w-8" />
          <Link to="/" className="text-xl font-bold">
            ScanWork
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        <div className="flex min-h-full items-center justify-center p-8">
          <div className="max-w-md w-full space-y-6 bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold">Crear Cuenta</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Crea una cuenta para comenzar a usar la aplicación Scanwork.
              </p>
            </div>
            <Form
              title="Crear Cuenta"
              fields={[
                {
                  label: "Nombre Completo",
                  name: "fullName",
                  placeholder: "Juan Roman",
                  type: "text",
                  required: true,
                },
                {
                  label: "RUT",
                  name: "rut",
                  placeholder: "12.345.678-9",
                  type: "text",
                  required: true,
                },
                {
                  label: "Correo electrónico",
                  name: "email",
                  placeholder: "example@gmail.com",
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
              buttonText="Crear Cuenta"
              onSubmit={registerSubmit}
              footerContent={
                <div className="flex items-center justify-between">
                  <span>¿Tienes una cuenta?</span>
                  <Link to="/login" className="underline">
                    Iniciar Sesión
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

export default Register;
