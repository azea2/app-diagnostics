import { useNavigate } from "react-router-dom";

const CloseButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/view6")}
      className="bg-gray-500 text-white px-4 py-2 rounded"
    >
      Cerrar
    </button>
  );
};

export default CloseButton;