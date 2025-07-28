return (
  <div className="p-4 min-h-screen mx-auto max-w-7xl">
    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

    <div>
      <h2 className="font-semibold mb-4">Acciones rápidas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/table_attendance")}
          className="flex items-center justify-center gap-2 py-3"
        >
          <Eye className="w-5 h-5" />
          <span>Ver Asistencia</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/attendance")}
          className="flex items-center justify-center gap-2 py-3"
        >
          <QrCode className="w-5 h-5" />
          <span>Escanear QR</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/qr_display")}
          className="flex items-center justify-center gap-2 py-3"
        >
          <QrCode className="w-5 h-5" />
          <span>Ver QR del día</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/workdays")}
          className="flex items-center justify-center gap-2 py-3"
        >
          <Calendar className="w-5 h-5" />
          <span>Ver calendario</span>
        </Button>
      </div>
    </div>
  </div>
);