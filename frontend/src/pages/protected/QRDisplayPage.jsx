// src/pages/QRDisplayPage.jsx o .tsx
import { useEffect, useState } from "react";
import { obtenerQR } from "@/services/qr.service";
import { Button } from "@/components/ui/button";

function QRDisplayPage() {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await obtenerQR();
      setQrImage(res?.qrImage || null);
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
      <h1 className="text-2xl font-bold mb-4">Código QR generado</h1>

      {loading && <p className="text-gray-500">Cargando QR...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {qrImage && (
        <img
          src={qrImage}
          alt="QR generado"
          className="w-64 h-64 border rounded shadow mb-4"
        />
      )}

      <Button onClick={cargarQR}>Generar nuevo QR</Button>
    </div>
  );
}

export default QRDisplayPage;
