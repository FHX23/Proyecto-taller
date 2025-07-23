import { Button } from "@/components/ui/button";
import { QrCode, Eye, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen ml-32 max-w-7xl px-32">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div>
        <h2 className="font-semibold mb-2">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-4 ">
          <Button
            variant="outline"
            onClick={() => navigate("/table_attendance")}
            className="flex items-center justify-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>Ver Asistencia</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/attendance")}
            className="flex items-center justify-center space-x-2"
          >
            <QrCode className="w-5 h-5" />
            <span>Escanear QR</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/qr_display")}
            className="flex items-center justify-center space-x-2"
          >
            <QrCode className="w-5 h-5" />
            <span>Ver QR del dia</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/workdays")}
            className="flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Ver calendario</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
