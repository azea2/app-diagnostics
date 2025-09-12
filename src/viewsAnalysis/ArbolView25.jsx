import React, { useState } from "react";

const Nodo = ({ textoInicial, tipo, onEliminar }) => {
  const [texto, setTexto] = useState(textoInicial);
  const [hijos, setHijos] = useState([]);

  const agregarHijo = () => {
    setHijos([
      ...hijos,
      {
        id: Date.now(),
        texto: tipo === "causa" ? "Nueva Causa" : "Nuevo Efecto",
      },
    ]);
  };

  return (
    <div className="relative flex flex-col items-center group">
      {/* Efectos → arriba */}
      {tipo === "efecto" && (
        <>
          {/* Sub-efectos renderizados arriba (igual que causas pero invertido) */}
          {hijos.length > 0 && (
            <div className="relative mb-3">
              <div className="flex gap-4 justify-center relative">
                {hijos.map((hijo) => (
                  <div key={hijo.id} className="relative">
                    <Nodo
                      textoInicial={hijo.texto}
                      tipo={tipo}
                      onEliminar={() =>
                        setHijos(hijos.filter((h) => h.id !== hijo.id))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón para agregar sub-efectos */}
          <div className="mb-2">
            <button
              onClick={agregarHijo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
            >
              + Sub-efecto
            </button>
          </div>
        </>
      )}

      {/* Nodo actual - SIEMPRE en la misma posición relativa */}
      <div className="relative border-2 border-gray-600 px-4 py-3 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
        <input
          type="text"
          value={texto}
          placeholder={tipo === "causa" ? "Causa..." : "Efecto..."}
          onFocus={(e) => {
            if (
              e.target.value === "Nueva Causa" ||
              e.target.value === "Nuevo Efecto"
            ) {
              setTexto("");
            }
          }}
          onChange={(e) => setTexto(e.target.value)}
          className="text-center outline-none w-full font-medium"
        />

        {/* Botón eliminar */}
        <button
          onClick={onEliminar}
          className="hidden group-hover:block absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-sm transition-colors duration-200 shadow-md"
        >
          ×
        </button>
      </div>

      {/* Causas → abajo */}
      {tipo === "causa" && (
        <>
          {/* Botón para agregar sub-causas */}
          <div className="mt-2">
            <button
              onClick={agregarHijo}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
            >
              + Sub-causa
            </button>
          </div>

          {/* Sub-causas renderizadas abajo */}
          {hijos.length > 0 && (
            <div className="relative mt-3">
              <div className="flex gap-4 justify-center relative">
                {hijos.map((hijo) => (
                  <div key={hijo.id} className="relative">
                    <Nodo
                      textoInicial={hijo.texto}
                      tipo={tipo}
                      onEliminar={() =>
                        setHijos(hijos.filter((h) => h.id !== hijo.id))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ArbolView25 = () => {
  const [efectos, setEfectos] = useState([]);
  const [causas, setCausas] = useState([]);
  const [problema, setProblema] = useState("Problema Central");

  const agregarEfecto = () => {
    setEfectos([...efectos, { id: Date.now(), texto: "Nuevo Efecto" }]);
  };

  const agregarCausa = () => {
    setCausas([...causas, { id: Date.now(), texto: "Nueva Causa" }]);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-bold mb-4">Árbol de Problemas</h2>

      {/* Efectos */}
      <div className="flex gap-4 mb-4 items-end">
        {efectos.map((efecto) => (
          <Nodo
            key={efecto.id}
            textoInicial={efecto.texto}
            tipo="efecto"
            onEliminar={() =>
              setEfectos(efectos.filter((e) => e.id !== efecto.id))
            }
          />
        ))}
      </div>
      <button
        onClick={agregarEfecto}
        className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
      >
        + Efecto
      </button>

      {/* Problema central */}
      <div className="relative border border-gray-600 px-4 py-2 rounded-lg bg-white shadow-md mb-4">
        <input
          type="text"
          value={problema}
          placeholder="Problema central..."
          onFocus={(e) => {
            if (e.target.value === "Problema Central") {
              setProblema("");
            }
          }}
          onChange={(e) => setProblema(e.target.value)}
          className="text-center outline-none w-full"
        />
      </div>

      {/* Causas */}
      <button
        onClick={agregarCausa}
        className="bg-red-500 text-white px-3 py-1 rounded mb-4"
      >
        + Causa
      </button>
      <div className="flex gap-4 items-start">
        {causas.map((causa) => (
          <Nodo
            key={causa.id}
            textoInicial={causa.texto}
            tipo="causa"
            onEliminar={() =>
              setCausas(causas.filter((c) => c.id !== causa.id))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ArbolView25;