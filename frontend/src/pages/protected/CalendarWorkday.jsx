"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAllWorkdays, createWorkdayManual } from "@/services/workDay.service"
import dayjs from "dayjs"
import { Switch } from "@/components/ui/switch"

const CalendarWorkday = () => {
  const [workdays, setWorkdays] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [isWorkingDay, setIsWorkingDay] = useState(true)
  const [payAmount, setPayAmount] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllWorkdays()
        setWorkdays(data.map((w) => w.date))
      } catch (error) {
        toast.error("Error al obtener los días laborales.")
      }
    }
    fetch()
  }, [])

  const isDateInWorkdays = (date) => {
    return workdays.includes(dayjs(date).format("YYYY-MM-DD"))
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    if (isDateInWorkdays(date)) {
      toast.warning("Ya existe un Workday para este día.")
      setDialogOpen(false)
    } else {
      setDialogOpen(true)
    }
  }

  const handleCreate = async () => {
    const date = dayjs(selectedDate).format("YYYY-MM-DD")
    if (isDateInWorkdays(date)) {
      toast.warning("Ya existe un Workday para este día.")
      setDialogOpen(false)
      return
    }

    if (isWorkingDay && (!payAmount || Number(payAmount) <= 0)) {
      toast.error("Ingrese un monto válido.")
      return
    }

    try {
      await createWorkdayManual({
        date,
        isWorkingDay,
        payAmount: isWorkingDay ? Number(payAmount) : null,
      })
      toast.success("Workday creado exitosamente.")
      setWorkdays((prev) => [...prev, date])
      setPayAmount("")
      setDialogOpen(false)
    } catch (error) {
      toast.error("Error al crear el Workday.")
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setPayAmount("")
    setIsWorkingDay(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* CALENDARIO */}
      <div className="max-w-xl mx-auto pt-10 space-y-6 px-4">
        <h2 className="text-2xl font-bold text-center">Calendario de Workdays</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={{
            hasWorkday: (date) => isDateInWorkdays(date),
          }}
          modifiersClassNames={{
            hasWorkday: "bg-green-500 text-white hover:bg-green-600",
          }}
          className="rounded-md border shadow-sm"
        />
        {selectedDate && !isDateInWorkdays(selectedDate) && (
          <Button className="w-full" onClick={() => setDialogOpen(true)}>
            Crear Workday para {dayjs(selectedDate).format("DD/MM/YYYY")}
          </Button>
        )}
      </div>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Crear Workday - {selectedDate && dayjs(selectedDate).format("DD/MM/YYYY")}
            </DialogTitle>
          </DialogHeader>

         <div className="space-y-6 py-4">
  <div className="flex items-center justify-between gap-4">
    <Label htmlFor="isWorkingDay" className="text-base font-medium">
      ¿Es día laboral?
    </Label>
    <div className="flex gap-2">
      <Button
        type="button"
        variant={isWorkingDay ? "default" : "outline"}
        className={isWorkingDay ? "bg-green-600 hover:bg-green-700 text-white" : ""}
        onClick={() => setIsWorkingDay(true)}
      >
        Sí
      </Button>
      <Button
        type="button"
        variant={!isWorkingDay ? "default" : "outline"}
        className={!isWorkingDay ? "bg-red-600 hover:bg-red-700 text-white" : ""}
        onClick={() => setIsWorkingDay(false)}
      >
        No
      </Button>
    </div>
  </div>

  {isWorkingDay && (
    <div className="space-y-2">
      <Label htmlFor="payAmount" className="text-sm font-medium">
        Monto de pago:
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

  <div className="flex gap-3 pt-4">
    <Button
      variant="outline"
      onClick={handleDialogClose}
      className="flex-1 bg-transparent"
    >
      Cancelar
    </Button>
    <Button onClick={handleCreate} className="flex-1">
      Confirmar creación
    </Button>
  </div>
</div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CalendarWorkday