import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [rol, setRol] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedRol = localStorage.getItem("rol");
    setRol(storedRol);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rol");
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-300 shadow-sm relative">
      <Link to="/home" className="flex items-center gap-2">
        <img src="/src/assets/LogoSinFondo.png" alt="Logo" className="w-8 h-8" />
        <h1 className="text-lg font-semibold">Social Diagnostics</h1>
      </Link>

      <nav className="flex gap-4 items-center">
        {rol === "admin" && (
          <>
            <Link to="/home" className="hover:text-teal-500">Home</Link>
            <Link to="/dashboard" className="hover:text-teal-500">Dashboard</Link>
          </>
        )}

        {rol === "colaborador" && (
          <Link to="/view6" className="hover:text-teal-500">Home</Link>
        )}

        {/* Icono circular con la A */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-4 w-8 h-8 rounded-full bg-gray-200 text-black-700 flex items-center justify-center hover:bg-gray-300"
          >
            A
          </button>

          {/* Menú desplegable */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2">
              <button
                onClick={handleLogout}
                className="text-sm text-black-500 hover:text-sky-500 px-2 py-1 w-full text-left"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;