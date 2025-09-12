import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    //Definir el rol
    const rol = "admin"; // "admin o colaborador"
    localStorage.setItem("rol", rol);

    if (rol === "admin") {
      navigate("/home");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen relative">
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <img src="/src/assets/LogoSinFondo.png" alt="Logo" className="w-5 h-5"/>
        <span className="text-lg font-semibold">Social Diagnostics</span>
      </div>

      {/* Formulario de login */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-80 min-h-96 ring-1 ring-gray-200 flex flex-col justify-center">
        <h1 className="text-2xl font-semibold mb-14 text-center text-gray-800">Iniciar sesión</h1>

        <div class="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="usuario"
            id="usuario"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-400 peer"
            placeholder=" "
            required
          />
          <label for="usuario" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Usuario
          </label>
        </div>

        <div class="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="password"
            id="password"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-400 peer"
            placeholder=" "
            required
          />
          <label for="password" class="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Contraseña
          </label>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-teal-400 text-white py-2 rounded-xl transition hover:bg-teal-500 active:scale-95"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;