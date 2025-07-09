import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";

function QRPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scanning) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          requestRef.current = requestAnimationFrame(scanFrame);
        }
      } catch (err) {
        console.error(err);
        setError("No se pudo acceder a la cámara.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      cancelAnimationFrame(requestRef.current);
    };
  }, [scanning]);

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      video?.readyState === video.HAVE_ENOUGH_DATA &&
      canvas &&
      canvas.getContext
    ) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        const scanned = code.data;
        setQrData(scanned);
        setScanning(false);

        const validPrefix =
          "https://proyecto-taller-production.up.railway.app/api/attendance";
        if (scanned.startsWith(validPrefix)) {
          sendToService(scanned);
        } else {
          setError("Código QR no válido.");
        }
        return;
      }
    }

    requestRef.current = requestAnimationFrame(scanFrame);
  };

  const sendToService = async (scannedUrl) => {
    try {
      const response = await fetch(scannedUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scannedAt: new Date().toISOString() }),
      });

      if (!response.ok) throw new Error("Error al enviar datos");

      console.log("Enviado correctamente");
    } catch (err) {
      console.error(err);
      setError("Error al contactar con el servicio.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Button onClick={() => setScanning((prev) => !prev)}>
        {scanning ? "Detener Escaneo" : "Escanear"}
      </Button>

      {scanning && (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full max-w-md rounded object-contain bg-black"
        />
      )}
      <canvas ref={canvasRef} className="hidden" />

      {qrData && (
        <p className="text-green-600 font-semibold break-words text-center">
          Código QR: {qrData}
        </p>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}

export default QRPage;
