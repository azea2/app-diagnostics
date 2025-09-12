import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import PageWithNavigation from "../components/PageWithNavigation";

const View7 = () => {
  const navigate = useNavigate();

  const techniques = [
    "Entrevista",
    "Encuesta",
    "Observación participante",
    "Observación no participante",
    "Grupo focal",
    "Sociodrama",
  ];

  // 👇 aquí decides cuáles técnicas están bloqueadas
  const [lockedTechniques] = useState({
    Entrevista: false, // ✅ disponible
    Encuesta: true,
    "Observación participante": true,
    "Observación no participante": true,
    "Grupo focal": true,
    Sociodrama: true,
  });

  const [selected, setSelected] = useState(null);

  const handleSelect = (technique) => {
    if (lockedTechniques[technique]) return; // si está bloqueada, no hace nada

    setSelected(technique);
    console.log("Técnica seleccionada:", technique);

    // Navegar solo si está desbloqueada
    if (technique === "Entrevista") {
      navigate("/entrevista");
    }
  };

  return (
    <PageWithNavigation
      onBack={() => navigate("/diagnosticSummary")}
      showNext={false}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Técnicas de Recolección de Información
        </h1>

        <h2 className="text-lg font-semibold text-gray-700">
          Selecciona una técnica
        </h2>

        {/* Grid de 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techniques.map((technique, idx) => {
            const isLocked = lockedTechniques[technique];

            return (
              <div
                key={idx}
                onClick={() => handleSelect(technique)}
                className={`relative cursor-pointer p-6 rounded-2xl shadow-lg border transition-all duration-200 
                  ${
                    isLocked
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : selected === technique
                      ? "bg-blue-600 text-white border-blue-700 shadow-xl scale-105"
                      : "bg-white hover:shadow-xl hover:border-blue-400"
                  }`}
              >
                <h3 className="text-xl font-semibold">{technique}</h3>

                {/* Candado en la esquina inferior derecha */}
                {isLocked && (
                  <div className="absolute bottom-2 right-2 text-gray-600">
                    <Lock size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageWithNavigation>
  );
};

export default View7;