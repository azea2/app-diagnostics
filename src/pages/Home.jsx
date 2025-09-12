import { useNavigate } from "react-router-dom";
import FloatingPanel from "../components/FloatingPanel";
import NavigationButton from "../components/NavigationButton";

const Home = ({ role = "admin" }) => {
  const navigate = useNavigate();

  const handleVerClick = () => {
    if (role === "admin") {
      navigate("/diagnosticSummary");
    } else {
      navigate("/view7");
    }
  };

  return (
    <>
      <FloatingPanel>
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl">
                  ☺️
                </div>
                <h2 className="text-xl mt-2">Welcome, Angela</h2>
              </div>

              <h3 className="text-lg font-semibold mb-2">Diagnósticos Activos</h3>
              <ul className="space-y-2">
                {[1, 2, 3].map((diag) => (
                  <li
                    key={diag}
                    className="flex justify-between items-center p-2 rounded"
                  >
                    <span>Diagnóstico {diag}</span>
                    <button
                      onClick={handleVerClick}
                      className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                    >
                      Ver
                    </button>
                  </li>
                ))}
              </ul>
      </FloatingPanel>
    </>
  );
};

export default Home;