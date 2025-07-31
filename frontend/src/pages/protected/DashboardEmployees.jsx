import { useEffect, useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const DashboardEmployees = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [calendarUser, setCalendarUser] = useState(null);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", rut: "", email: "", isMinor: false, paymentType: "Mensual" });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers([
        { id: "1", fullName: "Juan Pérez", rut: "11.111.111-1", email: "juan@example.com", isMinor: false, paymentType: "Mensual" },
        { id: "2", fullName: "Ana García", rut: "22.222.222-2", email: "ana@example.com", isMinor: true, paymentType: "Diario" },
        { id: "3", fullName: "Luis Soto", rut: "33.333.333-3", email: "luis@example.com", isMinor: false, paymentType: "Mensual" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (usuariosFiltrados.every((u) => selectedUsers.includes(u.id))) {
      setSelectedUsers((prev) => prev.filter((id) => !usuariosFiltrados.some((u) => u.id === id)));
    } else {
      const nuevos = usuariosFiltrados.map((u) => u.id);
      setSelectedUsers((prev) => Array.from(new Set([...prev, ...nuevos])));
    }
  };

  const eliminarSeleccionados = () => {
    toast.warning("Función eliminar múltiples no implementada aún.");
  };

  const editarUsuario = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setEditingUser(user);
      setEditForm(user);
      setShowEditDialog(true);
    }
  };

  const verCalendario = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCalendarUser(user);
      setShowCalendarDialog(true);
    }
  };

  const eliminarUsuario = (userId) => {
    toast.warning(`Eliminar usuario ${userId}`);
  };

  const usuariosFiltrados = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const guardarCambios = () => {
    toast.success("Cambios guardados (simulado)");
    setShowEditDialog(false);
  };

  const todosSeleccionados = usuariosFiltrados.length > 0 && usuariosFiltrados.every((u) => selectedUsers.includes(u.id));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-center">
            <div className="flex items-center gap-2">
              <Checkbox checked={todosSeleccionados} onCheckedChange={toggleAllUsers} />
              <span className="text-sm text-muted-foreground">Seleccionar todos</span>
            </div>
            <Input
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:w-1/2"
            />
            <Button
              variant="destructive"
              disabled={selectedUsers.length === 0}
              onClick={eliminarSeleccionados}
            >
              🗑️ Eliminar cuentas seleccionadas
            </Button>
          </div>

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
                  <TableCell colSpan={5} className="text-center py-4">
                    Cargando usuarios...
                  </TableCell>
                </TableRow>
              ) : usuariosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              ) : (
                usuariosFiltrados.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.rut}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => editarUsuario(user.id)}>
                        ✏️ Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => verCalendario(user.id)}>
                        📅 Calendario
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => eliminarUsuario(user.id)}>
                        🗑️ Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nombre completo</Label>
              <Input value={editForm.fullName} onChange={(e) => handleEditChange("fullName", e.target.value)} />
            </div>
            <div>
              <Label>RUT</Label>
              <Input value={editForm.rut} onChange={(e) => handleEditChange("rut", e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={editForm.email} onChange={(e) => handleEditChange("email", e.target.value)} />
            </div>
            <div>
              <Label>Tipo de pago</Label>
              <Input value={editForm.paymentType} onChange={(e) => handleEditChange("paymentType", e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={editForm.isMinor} onCheckedChange={(val) => handleEditChange("isMinor", val)} />
              <Label>Es menor de edad</Label>
            </div>
            <Button onClick={guardarCambios}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de calendario */}
      <Dialog open={showCalendarDialog} onOpenChange={setShowCalendarDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Calendario de {calendarUser?.fullName}</DialogTitle>
          </DialogHeader>
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            (Aquí se mostrará un calendario...)
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardEmployees;
