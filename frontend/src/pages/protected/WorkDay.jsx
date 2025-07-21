import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const WorkDay = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createWorkDay= async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await obtenerQR();
      } catch (err) {
        setError("No se pudo obtener el QR.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      cargarQR();
    }, []);
    return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen">
      {loading && <p className="text-gray-500">Cargando QR...</p>}
      <Button onClick={cargarQR}>Generar nuevo QR</Button>
    </div>
  );
}

export default WorkDay;