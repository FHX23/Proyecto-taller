import { useEffect, useState } from "react";
import { obtenerResumenAsistencia } from "@/services/attendance.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import dayjs from "dayjs";

const AttendancePage = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const validarFechas = () => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const today = dayjs();

    if (!start.isValid() || !end.isValid()) {
      toast.error("Formato de fecha inválido.");
      return false;
    }

    if (start.year() < 2025 || end.year() < 2025) {
      toast.error("El año mínimo permitido es 2025.");
      return false;
    }

    if (start.isAfter(end)) {
      toast.error("La fecha de inicio no puede ser posterior a la final.");
      return false;
    }

    if (end.isAfter(today)) {
      toast.error("La fecha final no puede ser mayor a hoy.");
      return false;
    }

    return true;
  };

  const cargarDatos = async () => {
    if (!validarFechas()) return;

    setCargando(true);
    setError(null);
    try {
      const res = await obtenerResumenAsistencia(startDate, endDate);
      if (res.status === "Success") {
        setData(res.data);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Error al cargar los datos.");
    } finally {
      setCargando(false);
    }
  };

  // Establecer fechas por defecto: últimos 7 días
  useEffect(() => {
    const hoy = dayjs().format("YYYY-MM-DD");
    const hace7dias = dayjs().subtract(6, "day").format("YYYY-MM-DD");
    setStartDate(hace7dias);
    setEndDate(hoy);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Resumen de Asistencia</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Fecha de inicio</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Fecha final</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                className="w-full py-3 text-base font-semibold bg-stone-300 hover:bg-stone-600 active:scale-95 transition-transform duration-150"
                onClick={cargarDatos}
                disabled={cargando}> {cargando ? "Buscando..." : "🔍 Buscar"}
                </Button>
            </div>
          </div>

          {/* Tabla */}
          {cargando ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Días Asistidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No hay datos disponibles en el rango seleccionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.fullName}</TableCell>
                      <TableCell>{item.rut}</TableCell>
                      <TableCell>{item.attendanceCount}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
