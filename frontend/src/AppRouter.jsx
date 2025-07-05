import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Error404 from "./pages/public/Error404";

// Layout y protección
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Páginas protegidas
import Home from "./pages/protected/Home";

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas: no requieren login */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 
        Rutas protegidas: solo accesibles si el usuario está autenticado.
        Usan un layout común (MainLayout) y están envueltas por <ProtectedRoute />.
        Puedes anidar aquí todas las rutas que deben estar protegidas.
      */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        {/* Agrega más rutas protegidas aquí */}
      </Route>

      {/* Página 404 si no se encuentra ninguna ruta */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRouter;
