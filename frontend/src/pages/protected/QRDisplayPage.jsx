import { useEffect, useState } from "react";
import { obtenerQR } from "@/services/qr.service";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

const QRDisplayPage = () => {
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

  const generarPDF = () => {
    if (!qrImage) return;

    const date = new Date();
    const formatter = new Intl.DateTimeFormat("es-CL", {
      timeZone: "America/Santiago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const [{ value: day }, , { value: month }, , { value: year }] = formatter.formatToParts(date);
    const nombreArchivo = `QR (${year}-${month}-${day}).pdf`;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const qrSize = 150;
    const x = (pageWidth - qrSize) / 2;
    const y = 40;

    pdf.addImage(qrImage, 'PNG', x, y, qrSize, qrSize);
    pdf.save(nombreArchivo);
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

      <Button className="bg-white text-black border border-black hover:bg-gray-200 "
      onClick={generarPDF}>Generar impresión (PDF)</Button>
    </div>
  );
};

export default QRDisplayPage;