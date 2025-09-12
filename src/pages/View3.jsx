import { useNavigate } from "react-router-dom";
import PageWithNavigation from "../components/PageWithNavigation";

const View3 = () => {
  const navigate = useNavigate();

  return (
    <PageWithNavigation 
    onBack={() => navigate("/dashboard")}
    onNext={() => navigate("/view4")}
    >
      <div className="space-y-4">
        <h1 className="text-2xl">Caracterización</h1>
        <label>Nombre</label>
        <input className="border p-2 w-full" />
        <label>Edad</label>
        <input className="border p-2 w-full" />
      </div>
    </PageWithNavigation>
  );
};

export default View3;
