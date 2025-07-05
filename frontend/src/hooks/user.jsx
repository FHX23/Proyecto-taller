import { useState, useEffect } from "react";
import { getUsers } from "../../services/user.service";

const UpdateReservationDialog = ({
  isOpen,
  onClose,
  onUpdate,
  reservation,
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Cargar la lista de usuarios al abrir el dialog
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleUserSelection = (email) => {
    const user = users.find((u) => u.email === email);
    setSelectedUser(user);
  };

  const handleUpdate = () => {
    if (selectedUser) {
      onUpdate({ ...reservation, userId: selectedUser.id });
    }
  };

  return (
    isOpen && (
      <div className="dialog">
        <h3>Actualizar Reserva</h3>

        {/* Selector de usuario */}
        <label htmlFor="user-select">Selecciona un nuevo usuario:</label>
        <select
          id="user-select"
          onChange={(e) => handleUserSelection(e.target.value)}
        >
          <option value="">-- Seleccionar usuario --</option>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>

        {/* Mostrar datos del usuario seleccionado */}
        {selectedUser && (
          <div className="user-details">
            <h4>Datos del usuario:</h4>
            <p>
              <strong>ID:</strong> {selectedUser.id}
            </p>
            <p>
              <strong>Nombre:</strong> {selectedUser.nombreCompleto}
            </p>
            <p>
              <strong>RUT:</strong> {selectedUser.rut}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Rol:</strong> {selectedUser.rol}
            </p>
          </div>
        )}

        {/* Botones */}
        <button onClick={handleUpdate}>Actualizar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    )
  );
};

export default UpdateReservationDialog;