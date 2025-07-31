import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getUsers,
  updateUser,
  deactivateUser,
  deactivateUsers,
} from "@/services/user.service";
import {
  getAttendancesByUserId,
  createManualAttendance,
  deleteManualAttendance,
} from "@/services/attendance.service";
import { getAllWorkdays } from "@/services/workDay.service.js";
import dayjs from "dayjs";
import 'dayjs/locale/es';

// Configura dayjs para usar el idioma español globalmente
dayjs.locale('es');

// --- Componente de Calendario (con Diálogo de Confirmación) ---
const UserCalendar = ({ userId, userName }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [attendances, setAttendances] = useState(new Set());
  const [workdays, setWorkdays] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null); // Estado para el diálogo

  // Carga los datos del calendario (asistencias y días laborales)
  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const [attendanceData, workdayData] = await Promise.all([
        getAttendancesByUserId(userId),
        getAllWorkdays()
      ]);
      const attendanceSet = new Set(attendanceData.map(att => dayjs(att.workday.date).format('YYYY-MM-DD')));
      setAttendances(attendanceSet);
      const workdayMap = new Map(workdayData.map(wd => [dayjs(wd.date).format('YYYY-MM-DD'), wd]));
      setWorkdays(workdayMap);
    } catch (error) {
      toast.error("Error al cargar datos del calendario: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [userId, currentDate]);

  // Prepara la confirmación cuando se hace clic en un día
  const handleDayClick = (day) => {
    const dateStr = day.format('YYYY-MM-DD');
    if (!workdays.has(dateStr) || day.isAfter(dayjs(), 'day')) {
      return;
    }
    const hasAttendance = attendances.has(dateStr);
    setConfirmation({
      day,
      dateStr,
      hasAttendance,
      userId, // Pasamos el userId a la confirmación
    });
  };

  // Ejecuta la acción después de que el usuario confirma en el diálogo
  const executeConfirmation = async () => {
    if (!confirmation) return;
    const { userId, dateStr, hasAttendance } = confirmation;
    
    // Define la acción a ejecutar
    const promiseAction = () => hasAttendance
      ? deleteManualAttendance(userId, dateStr)
      : createManualAttendance(userId, dateStr);

    // Muestra un toast de "cargando" mientras se ejecuta la promesa
    const promise = promiseAction();
    toast.promise(promise, {
      loading: "Actualizando asistencia...",
      success: () => {
        fetchCalendarData(); // Recarga los datos
        setConfirmation(null); // Cierra el diálogo
        return "Asistencia actualizada correctamente.";
      },
      error: (err) => `Error: ${err}`,
    });
  };

  // Lógica para generar los días del mes en el calendario
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
    <>
      <div className="p-4">
        <DialogHeader className="mb-4">
          <DialogTitle>Calendario de {userName}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>Anterior</Button>
          <h3 className="text-lg font-semibold capitalize">{currentDate.format('MMMM YYYY')}</h3>
          <Button variant="outline" onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>Siguiente</Button>
        </div>
        {loading ? (
          <div className="text-center py-8">Cargando datos del calendario...</div>
        ) : (
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d} className="font-bold text-sm text-muted-foreground">{d}</div>)}
            {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
            {daysInMonth.map((d) => {
              const dateStr = d.format('YYYY-MM-DD');
              const isWorkday = workdays.has(dateStr);
              const hasAttendance = attendances.has(dateStr);
              let dayClass = 'bg-gray-200 text-gray-500'; // Estilo por defecto: día no laboral
              if (isWorkday) {
                dayClass = hasAttendance ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600';
              }
              
              const isDisabled = d.isAfter(dayjs(), 'day') || !isWorkday;
              if (isDisabled) {
                dayClass += ' opacity-50 cursor-not-allowed';
              } else {
                dayClass += ' cursor-pointer';
              }

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDayClick(d)}
                  className={`p-2 rounded-full w-10 h-10 mx-auto flex items-center justify-center transition-colors ${dayClass}`}
                  disabled={isDisabled}
                >
                  {d.format('D')}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Diálogo de Confirmación para el calendario */}
      <Dialog open={!!confirmation} onOpenChange={() => setConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cambio de Asistencia</DialogTitle>
            <DialogDescription className="pt-2">
              ¿Estás seguro de que quieres cambiar la asistencia a "
              <strong>{confirmation?.hasAttendance ? 'ausente' : 'presente'}</strong>" para el día
              <strong> {confirmation?.day.format('D [de] MMMM [de] YYYY')}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmation(null)}>Cancelar</Button>
            <Button onClick={executeConfirmation}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// --- Componente Principal ---
const DashboardEmployees = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [calendarUser, setCalendarUser] = useState(null);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", rut: "", email: "", isMinor: false, paymentType: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error(`Error al cargar usuarios: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() =>
    users.filter(
      (u) =>
        u.isActive !== false &&
        (u.fullName.toLowerCase().includes(search.toLowerCase()) ||
         u.email.toLowerCase().includes(search.toLowerCase()) ||
         u.rut.toLowerCase().includes(search.toLowerCase()))
    ), [users, search]);

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleAllUsersSelection = () => {
    const allFilteredIds = filteredUsers.map((u) => u.id);
    if (allFilteredIds.every((id) => selectedUsers.includes(id))) {
      setSelectedUsers((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedUsers((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleDeleteSelected = () => {
    toast("¿Estás seguro de que quieres desactivar las cuentas seleccionadas?", {
      action: {
        label: "Confirmar",
        onClick: async () => {
          const promise = deactivateUsers(selectedUsers);
          toast.promise(promise, {
            loading: "Desactivando usuarios...",
            success: () => {
              fetchUsers();
              setSelectedUsers([]);
              return "Usuarios desactivados correctamente.";
            },
            error: (err) => `Error: ${err}`,
          });
        },
      },
      cancel: {
        label: "Cancelar",
      },
    });
  };
  
  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setEditForm({
        fullName: user.fullName || "",
        rut: user.rut || "",
        email: user.email || "",
        paymentType: user.paymentType || null,
        isMinor: user.isMinor || false,
      });
      setShowEditDialog(true);
    }
  };

  const handleViewCalendar = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCalendarUser(user);
      setShowCalendarDialog(true);
    }
  };

  const handleDeleteUser = (userId) => {
     toast("¿Estás seguro de que quieres desactivar esta cuenta?", {
      action: {
        label: "Confirmar",
        onClick: async () => {
           const promise = deactivateUser(userId);
           toast.promise(promise, {
             loading: "Desactivando usuario...",
             success: () => {
               fetchUsers();
               return "Usuario desactivado correctamente.";
             },
             error: (err) => `Error: ${err}`,
           });
        },
      },
      cancel: {
        label: "Cancelar",
      },
    });
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!editingUser) return;
    const changes = {};
    Object.keys(editForm).forEach(key => {
        if (editForm[key] !== editingUser[key]) {
            changes[key] = editForm[key];
        }
    });
    if (changes.paymentType === null) {
        toast.error("Debe seleccionar un tipo de pago.");
        return;
    }
    if (Object.keys(changes).length === 0) {
        toast.info("No se han realizado cambios.");
        setShowEditDialog(false);
        return;
    }
    const promise = updateUser(editingUser.id, changes);
    toast.promise(promise, {
      loading: "Guardando cambios...",
      success: () => {
        setShowEditDialog(false);
        fetchUsers();
        return "Usuario actualizado correctamente.";
      },
      error: (err) => `Error al guardar: ${err}`,
    });
  };

  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((u) => selectedUsers.includes(u.id));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestión de Empleados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Checkbox checked={allFilteredSelected} onCheckedChange={toggleAllUsersSelection} id="select-all"/>
              <Label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                Seleccionar todos
              </Label>
            </div>
            <Input
              placeholder="Buscar por nombre, email o RUT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-1/2"
            />
            <Button
              variant="destructive"
              disabled={selectedUsers.length === 0}
              onClick={handleDeleteSelected}
              className="w-full sm:w-auto"
            >
              🗑️ Desactivar Seleccionados
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-4" />
                  <TableHead>Nombre</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Cargando empleados...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No se encontraron empleados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.rut}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEditUser(user.id)}>
                          ✏️ Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleViewCalendar(user.id)}>
                          📅 Calendario
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          🗑️ Desactivar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* --- Diálogo de Edición --- */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input id="fullName" value={editForm.fullName} onChange={(e) => handleEditFormChange("fullName", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" value={editForm.rut} onChange={(e) => handleEditFormChange("rut", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={editForm.email} onChange={(e) => handleEditFormChange("email", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="paymentType">Tipo de pago</Label>
                <Select value={editForm.paymentType || ""} onValueChange={(value) => handleEditFormChange("paymentType", value)}>
                    <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Seleccionar tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="transferencia">Transferencia</SelectItem>
                        <SelectItem value="efectivo">Efectivo</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="isMinor" checked={editForm.isMinor} onCheckedChange={(val) => handleEditFormChange("isMinor", val)} />
              <Label htmlFor="isMinor" className="cursor-pointer">Es menor de edad</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Diálogo de Calendario --- */}
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="sm:max-w-lg">
          {calendarUser && <UserCalendar userId={calendarUser.id} userName={calendarUser.fullName} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardEmployees;