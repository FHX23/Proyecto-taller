import axios from "./root.service.js";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { convertirMinusculas } from "@/helpers/formatData.js";
import { getDeviceToken } from "@/utils/deviceToken";

export async function login(dataUser) {
  try {
    const response = await axios.post("/auth/login", {
      email: dataUser.email,
      password: dataUser.password,
    });

    const { status, data } = response;
    if (status === 200) {
      const { nombreCompleto, email, rut, rol } = jwtDecode(data.data.token);
      const userData = { nombreCompleto, email, rut, rol };
      sessionStorage.setItem("usuario", JSON.stringify(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      cookies.set("jwt-auth", data.data.token, { path: "/" });

      const deviceToken = await getDeviceToken();
      console.log(deviceToken);
      //await axios.post("/device/register", { deviceToken }); // el token JWT ya está en headers
      
      return response.data;
    }
  } catch (error) {
    throw error.response?.data?.details || "Hubo un problema al iniciar sesion.";
  }
}

export async function register(data) {
  try {
    const dataRegister = convertirMinusculas(data);
    const { fullName, email, rut, password } = dataRegister;
    const response = await axios.post("/auth/register", {
      fullName,
      email,
      rut,
      password,
    });
    
    return response.data;
  } catch (error) {
        // Lanzar solo el mensaje del error como string
        throw error.response?.data?.details || "Error al crear cuenta.";
  }
}

export async function logout() {
  try {
    await axios.post("/auth/logout");
    sessionStorage.removeItem("usuario");
    cookies.remove("jwt");
    cookies.remove("jwt-auth");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}