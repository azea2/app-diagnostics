import React from 'react';

const DiagnosticosPrevios = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Diagnósticos Previos</h1>
      <p className="text-gray-600 mb-7">Consulta el historial de diagnósticos ya finalizados.</p>
      {/* Aquí puedes incluir filtros, fechas o una tabla de resultados anteriores */}

        <div className="bg-white p-4 rounded shadow">
          <p>1er diagnóstico pasado</p>
          <button className="text-blue-600">Descargar informe</button>
        </div>
    </div>
  );
};

export default DiagnosticosPrevios;
