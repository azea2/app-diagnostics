import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWithNavigation from "../components/PageWithNavigation";

const Seleccionador = () => {
  const navigate = useNavigate();
  
  const techniques = [
    "Diagnóstico Social",
    "Diagnóstico Educativo",
    "Diagnóstico Empresarial",
    "Validación de Producto o Hipótesis",
  ];

  const [selected, setSelected] = useState(null);

  const handleSelect = (technique) => {
    setSelected(technique);
    // Aquí podrías guardar en estado global o contexto si quieres
    console.log("Técnica seleccionada:", technique);
  };

  return (
    <PageWithNavigation 
      onBack={() => navigate("/diagnosticSummary")}
      showNext={false}
    >

      <div className="space-y-6">
        <h1 className="text-3xl text-center font-bold text-gray-800">
          Qué quieres hacer hoy?
        </h1>

        {/* Grid de 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {techniques.map((technique, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(technique)}
              className={`cursor-pointer p-6 rounded-2xl shadow-lg border transition-all duration-200 
                ${selected === technique 
                  ? "bg-blue-600 text-white border-blue-700 shadow-xl scale-105" 
                  : "bg-white hover:shadow-xl hover:border-blue-400"}`}
            >
              <h3 className="text-xl font-semibold">{technique}</h3>
            </div>
          ))}
        </div>
      </div>
    </PageWithNavigation>
  );
};

export default Seleccionador;