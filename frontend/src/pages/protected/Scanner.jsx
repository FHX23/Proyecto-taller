import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { markAttendance } from "@/services/attendance.service";

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
  console.log("link escaneado",code.data);
  const scanned = code.data;
  setQrData(scanned);
  setScanning(false);
sendToService(scanned);
/*
  const validPrefixes = [
    "https://proyecto-taller-production.up.railway.app/api/attendance",
    "http://proyecto-taller-production.up.railway.app/api/attendance/markAttendance"
  ];

  const isValid = validPrefixes.some(prefix => scanned.startsWith(prefix));

  if (isValid) {
    sendToService(scanned);
  } else {
    setError("Código QR no válido.");
  }
    */
  return;
}
    }

    requestRef.current = requestAnimationFrame(scanFrame);
  };

  async function sendToService(scannedUrl) {
  try {
    const url = new URL(scannedUrl);
    const date = url.pathname.split("/").pop(); // Extrae "2025-07-09"
    console("la fecha de hoy es",date);
    const payload = {
      deviceToken: "abcd1234",
      latitude: -36.826991,
      longitude: -73.049774,
    };

    const result = await markAttendance(date, payload);

    if (result.status === "Error") {
      setError(result.message || "No se pudo marcar asistencia");
    } else {
      console.log("Asistencia marcada correctamente:", result.data);
    }
  } catch (err) {
    console.error(err);
    setError("Error al contactar con el servicio.");
  }
}

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
