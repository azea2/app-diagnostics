import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import PageWithNavigation from "../components/PageWithNavigation";

const View18 = () => {
  const navigate = useNavigate();

  const techniques = [
    "Árbol de Problemas",
    "Mapa de Actores",
    "Factores Determinantes, Condicionantes y de Riesgo",
    "Matriz de Prioridades",
    "Análisis PESTEL",
  ];

  // 👇 aquí decides cuáles técnicas están bloqueadas
  const [lockedTechniques] = useState({
    "Árbol de Problemas": false, // ✅ disponible
    "Mapa de Actores": true,
    "Factores Determinantes, Condicionantes y de Riesgo": true,
    "Matriz de Prioridades": true,
    "Análisis PESTEL": true,
  });

  const [selected, setSelected] = useState(null);

  const handleSelect = (technique) => {
    if (lockedTechniques[technique]) return; // si está bloqueada, no hace nada

    setSelected(technique);
    console.log("Técnica seleccionada:", technique);

    // Navegar solo si está desbloqueada
    if (technique === "Árbol de Problemas") {
      navigate("/arbol");
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

export default View18;