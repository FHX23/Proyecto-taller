import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllWorkdays, createWorkdayManual } from "@/services/workDay.service";
import dayjs from "dayjs";
import { Switch } from "@/components/ui/switch";

const CalendarWorkday = () => {
  const [workdays, setWorkdays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isWorkingDay, setIsWorkingDay] = useState(true);
  const [payAmount, setPayAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllWorkdays();
        setWorkdays(data.map((w) => w.date));
      } catch (error) {
        toast.error("Error al obtener los días laborales.");
      }
    };
    fetch();
  }, []);

  const isDateInWorkdays = (date) => {
    return workdays.includes(dayjs(date).format("YYYY-MM-DD"));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (isDateInWorkdays(date)) {
      toast.warning("Ya existe un Workday para este día.");
      setDialogOpen(false);
    } else {
      setDialogOpen(true);
    }
  };

  const handleCreate = async () => {
    const date = dayjs(selectedDate).format("YYYY-MM-DD");

    if (isDateInWorkdays(date)) {
      toast.warning("Ya existe un Workday para este día.");
      setDialogOpen(false);
      return;
    }

    if (isWorkingDay && (!payAmount || Number(payAmount) <= 0)) {
      toast.error("Ingrese un monto válido.");
      return;
    }

    try {
      await createWorkdayManual({
        date,
        isWorkingDay,
        payAmount: isWorkingDay ? Number(payAmount) : null,
      });
      toast.success("Workday creado exitosamente.");
      setWorkdays((prev) => [...prev, date]);
      setPayAmount("");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error al crear el Workday.");
    }
  };

  return (
    <>
      {/* CALENDARIO */}
      <div className="max-w-xl mx-auto mt-10 space-y-6">
        <h2 className="text-2xl font-bold text-center">Calendario de Workdays</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={{
            hasWorkday: (date) => isDateInWorkdays(date),
          }}
          modifiersClassNames={{
            hasWorkday: "bg-green-300 text-white",
          }}
          className="rounded-md border"
        />
        {selectedDate && !isDateInWorkdays(selectedDate) && (
          <Button
            className="w-full"
            onClick={() => setDialogOpen(true)}
          >
            Crear Workday para {dayjs(selectedDate).format("DD/MM/YYYY")}
          </Button>
        )}
      </div>

      {/* DIALOG FUERA DEL FLUJO VISUAL */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="z-[9999] sm:max-w-md">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Crear Workday - {dayjs(selectedDate).format("DD/MM/YYYY")}
            </h3>

            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="isWorkingDay" className="text-base">
                ¿Es día laboral?
              </Label>
              <div className="flex items-center gap-2">
                <span
                  className={
                    isWorkingDay ? "text-green-600 font-semibold" : "text-muted-foreground"
                  }
                >
                  Sí
                </span>
                <Switch
                  id="isWorkingDay"
                  checked={isWorkingDay}
                  onCheckedChange={setIsWorkingDay}
                />
                <span
                  className={
                    !isWorkingDay ? "text-red-600 font-semibold" : "text-muted-foreground"
                  }
                >
                  No
                </span>
              </div>
            </div>

            {isWorkingDay && (
              <div className="space-y-1">
                <Label htmlFor="payAmount">Monto de pago:</Label>
                <Input
                  id="payAmount"
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Ej: 30000"
                />
              </div>
            )}

            <Button onClick={handleCreate} className="w-full mt-4">
              Confirmar creación
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarWorkday;