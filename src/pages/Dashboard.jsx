import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Bienvenido from "../views/Bienvenido";
import CrearDiagnostico from "../views/CrearDiagnostico";
import DiagnosticosActuales from "../views/DiagnosticosActuales";
import DiagnosticosPrevios from "../views/DiagnosticosPrevios";
import ColaboradoresActivos from "../views/ColaboradoresActivos";
import CrearColaborador from "../views/CrearColaborador";


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("bienvenido");

  const renderContent = () => {
    switch (activeView) {
      case "bienvenido":
        return <Bienvenido />;
      case "crearDiagnostico":
        return <CrearDiagnostico />;
      case "diagnosticosActuales":
        return <DiagnosticosActuales />;
      case "diagnosticosPrevios":
        return <DiagnosticosPrevios />;
      case "colaboradoresActivos":
        return <ColaboradoresActivos />;
      case "crearColaborador":
        return <CrearColaborador />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {isSidebarOpen && (
        <Sidebar setActiveView={setActiveView} />
      )}

      <div className="flex-1 p-6 relative bg-gray-50">
        {/* Botón para mostrar/ocultar panel */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-10 bg-gray-300 hover:bg-gray-400 rounded-full p-2 cursor-pointer"
        >
          {isSidebarOpen ? "⟨" : "⟩"}
        </button>

        <div className="mt-2 ml-15">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
