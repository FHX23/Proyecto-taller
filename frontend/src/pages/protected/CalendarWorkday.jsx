"use client"

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllWorkdays,
  createWorkdayManual,
  updateWorkday,
} from "@/services/workDay.service.js";
import dayjs from "dayjs";
import 'dayjs/locale/es';

// Configura dayjs para usar el idioma español globalmente
dayjs.locale('es');

const CalendarWorkday = () => {
  const [workdays, setWorkdays] = useState(new Map());
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  
  // Estado para manejar el diálogo de creación/edición
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [payAmount, setPayAmount] = useState("");

  const fetchWorkdays = async () => {
    setLoading(true);
    try {
      const data = await getAllWorkdays();
      // Convertimos el array a un Map para un acceso más rápido
      const workdayMap = new Map(
        data.map(wd => [dayjs(wd.date).format('YYYY-MM-DD'), wd])
      );
      setWorkdays(workdayMap);
    } catch (error) {
      toast.error("Error al obtener los días laborales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkdays();
  }, []);

  const handleDayClick = (day) => {
    const dateStr = day.format('YYYY-MM-DD');
    const existingWorkday = workdays.get(dateStr);

    setSelectedDay(day);

    if (existingWorkday) {
      // Si ya existe, pre-llenamos el formulario para editar
      setIsWorkingDay(existingWorkday.isWorkingDay);
      setPayAmount(existingWorkday.payAmount || "");
    } else {
      // Si no existe, reseteamos el formulario para crear
      setIsWorkingDay(true);
      setPayAmount("");
    }
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedDay) return;

    const date = selectedDay.format('YYYY-MM-DD');
    const existingWorkday = workdays.get(date);

    // Validación
    if (isWorkingDay && (!payAmount || Number(payAmount) <= 0)) {
      toast.error("Si es un día laboral, debe ingresar un monto de pago válido.");
      return;
    }

    const workdayData = {
      date,
      isWorkingDay,
      payAmount: isWorkingDay ? Number(payAmount) : null,
    };

    const promise = existingWorkday
      ? updateWorkday(workdayData)
      : createWorkdayManual(workdayData);

    toast.promise(promise, {
      loading: `${existingWorkday ? 'Actualizando' : 'Creando'} día laboral...`,
      success: () => {
        fetchWorkdays(); // Recargamos los datos
        setIsDialogOpen(false); // Cerramos el diálogo
        return `Día laboral ${existingWorkday ? 'actualizado' : 'creado'} correctamente.`;
      },
      error: (err) => `Error: ${err}`,
    });
  };

  // Lógica para generar el calendario
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const daysInMonth = [];
  let day = startOfMonth;
  while (day.isBefore(endOfMonth) || day.isSame(endOfMonth, 'day')) {
    daysInMonth.push(day);
    day = day.add(1, 'day');
  }
  const firstDayOfWeek = startOfMonth.day();
  const paddingDays = Array.from({ length: firstDayOfWeek });

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>
              Anterior
            </Button>
            <h2 className="text-2xl font-bold text-center capitalize">
              {currentDate.format('MMMM YYYY')}
            </h2>
            <Button variant="outline" onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>
              Siguiente
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-16">Cargando calendario...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                <div key={d} className="font-bold text-sm text-muted-foreground pb-2">{d}</div>
              ))}
              {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
              {daysInMonth.map((d) => {
                const dateStr = d.format('YYYY-MM-DD');
                const workday = workdays.get(dateStr);
                let dayClass = 'bg-slate-100 hover:bg-slate-200 text-slate-800'; // No es Workday
                if (workday) {
                  dayClass = workday.isWorkingDay
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' // Laboral
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'; // No laboral
                }
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDayClick(d)}
                    // *** LA ÚNICA CORRECCIÓN ESTÁ AQUÍ ***
                    // Se añade la variable `dayClass` para que se aplique el color correcto.
                    className={`p-2 rounded-full w-16 h-16 flex flex-col justify-center items-center transition-colors cursor-pointer ${dayClass}`}
                  >
                    <span className="font-bold text-lg">{d.format('D')}</span>
                    {workday && (
                      <span className="text-xs mt-1">
                        {workday.isWorkingDay ? `$${workday.payAmount || 0}` : 'No laboral'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Gestionar Día Laboral
            </DialogTitle>
            <DialogDescription>
              {selectedDay?.format('dddd, D [de] MMMM [de] YYYY')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col space-y-3">
              <Label htmlFor="isWorkingDay" className="text-base font-medium">
                ¿Es día laboral?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={isWorkingDay ? "default" : "outline"}
                    onClick={() => setIsWorkingDay(true)}
                    className={isWorkingDay ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    Sí
                  </Button>
                  <Button
                    variant={!isWorkingDay ? "destructive" : "outline"}
                    onClick={() => setIsWorkingDay(false)}
                  >
                    No
                  </Button>
              </div>
            </div>
            {isWorkingDay && (
              <div className="space-y-2">
                <Label htmlFor="payAmount" className="text-sm font-medium">
                  Monto de pago
                </Label>
                <Input
                  id="payAmount"
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Ej: 30000"
                  className="w-full"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarWorkday;