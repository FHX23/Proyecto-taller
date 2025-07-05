import { Button } from "@/components/ui/button";
import { BookIcon, Calendar, BookOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded">Total de Libros: --</div>
        <div className="p-4 border rounded">Préstamos Activos: --</div>
        <div className="p-4 border rounded">Reuniones Programadas: --</div>
        <div className="p-4 border rounded">Actividades Extracurriculares: --</div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Solicitar nuevo rol</h2>
        <form>
          <select className="border rounded p-2 w-full mb-2">
            <option value="">Seleccione un rol</option>
            <option value="profesor">Profesor</option>
            <option value="alumno">Alumno</option>
            <option value="apoderado">Apoderado</option>
            <option value="bibliotecario">Bibliotecario</option>
            <option value="encargado taller">Encargado Taller</option>
          </select>
          <Button type="submit">Solicitar Rol</Button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/library/createBook")}
            className="flex items-center justify-center space-x-2"
          >
            <BookIcon className="w-5 h-5" />
            <span>Agregar Libro</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/activities")}
            className="flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Programar Actividad</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/library/booking/create")}
            className="flex items-center justify-center space-x-2"
          >
            <BookOpen className="w-5 h-5" />
            <span>Préstamo de Libro</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/meetings")}
            className="flex items-center justify-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Programar Reunión</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
