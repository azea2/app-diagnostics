import { useNavigate } from "react-router-dom";

const CrearDiagnostico = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/view3"); // Aquí pones la ruta de tu vista 7
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Diagnóstico</h1>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Crear
      </button>
    </div>
  );
};

export default CrearDiagnostico;
