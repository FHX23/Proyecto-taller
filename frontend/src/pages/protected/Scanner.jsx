import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { markAttendance } from "@/services/attendance.service";

const QRPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [dialog, setDialog] = useState({ open: false, title: "", description: "", success: false });

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
        setDialog({
          open: true,
          title: "Error",
          description: "No se pudo acceder a la cámara.",
          success: false,
        });
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
        setScanning(false); // detener escaneo

        const validPrefixes = [
          "http://proyecto-taller-production.up.railway.app/api/attendance/markAttendance",
          "https://proyecto-taller-production.up.railway.app/api/attendance/markAttendance",
          "http://localhost:3000/api/attendance/markAttendance",
          "https://localhost:3000/api/attendance/markAttendance"
        ];

        const isValid = validPrefixes.some(prefix => scanned.startsWith(prefix));

        if (isValid) {
          sendToService(scanned);
        } else {
          setDialog({
            open: true,
            title: "Código inválido",
            description: "El código QR escaneado no es válido para registrar asistencia.",
            success: false,
          });
        }

        return;
      }
    }

    requestRef.current = requestAnimationFrame(scanFrame);
  };

  async function sendToService(scannedUrl) {
    try {
      const url = new URL(scannedUrl);
      const date = url.pathname.split("/").pop();

      const payload = {
        deviceToken: "abcd1234",
        latitude: -36.826991,
        longitude: -73.049774,
      };

      const result = await markAttendance(date, payload);

      setDialog({
        open: true,
        title: "¡Asistencia registrada!",
        description: "Tu asistencia fue enviada exitosamente al sistema.",
        success: true,
      });

    } catch (err) {
      const mensaje =
        typeof err === "string"
          ? err
          : err?.message || "Error desconocido al marcar asistencia.";

      setDialog({
        open: true,
        title: "Error al registrar asistencia",
        description: mensaje,
        success: false,
      });
    }
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Button onClick={() => setScanning((prev) => !prev)}>
        {scanning ? "Detener escaneo" : "Escanear QR"}
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

      {/* POPUP DE RESULTADO */}
      <Dialog open={dialog.open} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={dialog.success ? "text-green-600" : "text-red-600"}>
              {dialog.title}
            </DialogTitle>
            <DialogDescription>
              {dialog.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRPage;