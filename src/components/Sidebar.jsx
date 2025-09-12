const Sidebar = ({ setActiveView }) => {
  return (
    <div className="w-64 bg-white shadow-md p-4 space-y-4">
      <h2 className="font-bold text-lg mb-4">Menú</h2>
      <ul className="space-y-2">
        <li><button onClick={() => setActiveView("crearDiagnostico")}>➕ Crear Diagnóstico</button></li>
        <li><button onClick={() => setActiveView("diagnosticosActuales")}>📋 Diagnósticos Actuales</button></li>
        <li><button onClick={() => setActiveView("diagnosticosPrevios")}>📁 Diagnósticos Previos</button></li>
        <li><button onClick={() => setActiveView("colaboradoresActivos")}>👥 Colaboradores Activos</button></li>
        <li><button onClick={() => setActiveView("crearColaborador")}>🧑‍💼 Crear Colaborador</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
