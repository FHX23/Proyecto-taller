import { Link, useNavigate } from "react-router-dom"; 
import { register } from "@/services/auth.service";
import useRegister from "@/hooks/auth/useLogin.jsx";
import Form from "@/components/layout/Form";
import { School } from "lucide-react";
import Footer from "@/components/layout/Footer";

// --- TOAST DESACTIVADO ---
// import { ToastAction } from "@/components/ui/toast";
// import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { errorEmail, errorRut, errorData, handleInputChange } = useRegister();

  // --- TOAST DESACTIVADO ---
  // const { toast } = useToast();

  const registerSubmit = async (data) => {
    try {
      // Llamar al servicio para registrar un usuario
      const response = await register(data);
  
      if (response.status === "Success") {
        // --- TOAST DESACTIVADO ---
        // toast({
        //   title: "Cuenta creada exitosamente",
        //   description: "Se ha creado la cuenta exitosamente",
        //   className: "bg-[#4CAF50] text-white py-2 px-4 rounded shadow-lg",
        //   position: "bottom-right",
        //   duration: 1500,
        //   onClick: () => {
        //     toast.dismiss();
        //   },
        // });

        // Redirigir al login después de un tiempo
        setTimeout(() => {
          navigate("/login");
        }, 1500);
  
      } else if (response.status === "Client error") {
        // Mostrar errores específicos si el backend los envía
        errorData(response.details);

        // --- TOAST DESACTIVADO ---
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "Hubo un problema al crear su cuenta",
        //   className: "bg-[#F44336] text-white py-2 px-4 rounded shadow-lg",
        //   position: "bottom-right",
        //   duration: 1500,
        //   onClick: () => {
        //     toast.dismiss();
        //   },
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
    } catch (err) {
      console.error("Error al registrar un usuario: ", err);

      // --- TOAST DESACTIVADO ---
      // const errorMessage = err || "Hubo un problema al crear la cuenta.";
      // toast({
      //   title: "Error",
      //   description: errorMessage,
      //   className: "bg-[#F44336] text-white py-2 px-4 rounded shadow-lg",
      //   position: "bottom-right",
      //   duration: 1500,
      //   onClick: () => {
      //     toast.dismiss();
      //   },
      // });
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <header className="flex items-center justify-center  gap-2 p-8 lg:px-6">
        <div className="flex justify-center items-center gap-2">
          <School className="h-8 w-8" />
          <Link to="/" className="text-xl font-bold">
            ScanWork
          </Link>
        </div>
      </header>

      <main className="flex-grow ">
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
                  name: "nombreCompleto",
                  placeholder: "Tony Stark",
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
