import { useNavigate } from "react-router-dom";
import PageWithNavigation from "../components/PageWithNavigation";

const View5 = () => {
  const navigate = useNavigate();

  return (
    <PageWithNavigation 
    onBack={() => navigate("/view4")}
    onNext={() => navigate("/dashboard")}
    nextText="Finalizar"
    >
      <div className="space-y-4">
        <h1 className="text-2xl">Finalizar diagnóstico</h1>
        <label><input type="checkbox" /> Confirmo finalización</label>
      </div>
    </PageWithNavigation>
  );
};

export default View5;