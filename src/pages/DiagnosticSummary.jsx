import { useNavigate } from "react-router-dom";
import { Play, Eye, Download } from "lucide-react";

const SummaryDiagnostic = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-6 space-y-6 mb-10">
      <h5 className="text-xl font-semibold text-gray-800">
        Empleo Juvenil Comuna 4 - Aranjuez
      </h5>

      {/* Técnicas de Recolección */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => handleClick("/view7")}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
            + Técnica Recolección
          </button>
        </div>

        <ul className="space-y-2">
          <li className="flex justify-between items-center">
            <span>Encuesta - Jóvenes Sector Parque Aranjuez</span>
            <div className="flex space-x-2">
              <button className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700">
                <Play size={16} /> {/* Aplicar */}
              </button>
              <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">
                <Eye size={16} /> {/* Ver */}
              </button>
              <button className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600">
                <Download size={16} /> {/* Descargar */}
              </button>
            </div>
          </li>

          <li className="flex justify-between items-center">
            <span>Entrevista - Jóvenes Sector Calvario</span>
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700">
                  <Play size={16} /> {/* Aplicar */}
                </button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">
                  <Eye size={16} /> {/* Ver */}
                </button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600">
                  <Download size={16} /> {/* Descargar */}
                </button>
              </div>
          </li>
        </ul>
      </div>

      {/* Técnicas de Análisis */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => handleClick("/view18")}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
            + Técnica Análisis
          </button>
        </div>

        <ul className="space-y-2">
          <li className="flex justify-between items-center">
            <span>Matriz DOFA - Jóvenes Sector Parque Aranjuez</span>
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700">
                  <Play size={16} /> {/* Aplicar */}
                </button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">
                  <Eye size={16} /> {/* Ver */}
                </button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600">
                  <Download size={16} /> {/* Descargar */}
                </button>
              </div>
          </li>

          <li className="flex justify-between items-center">
            <span>Informe Final - Jóvenes Sector Calvario</span>
              <div className="flex space-x-2">
                <button className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700">
                  <Play size={16} /> {/* Aplicar */}
                </button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600">
                  <Eye size={16} /> {/* Ver */}
                </button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded text-sm hover:bg-gray-600">
                  <Download size={16} /> {/* Descargar */}
                </button>
              </div>
          </li>
        </ul>
      </div>
    </div>
    </div>
    
  );
};

export default SummaryDiagnostic;