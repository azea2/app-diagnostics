import { useNavigate } from "react-router-dom";
import PageWithNavigation from "../components/PageWithNavigation";

const View4 = () => {
  const navigate = useNavigate();

  return (
    <PageWithNavigation 
    onBack={() => navigate("/view3")}
    onNext={() => navigate("/view5")}
    >
      <div className="space-y-4">
        <h1 className="text-2xl">Tipo de diagnóstico</h1>
        <p>Selecciona el tipo:</p>
        <label><input type="checkbox" /> Opción 1</label>
        <label><input type="checkbox" /> Opción 2</label>
      </div>
    </PageWithNavigation>
  );
};

export default View4;