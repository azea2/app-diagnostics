import React from 'react';
import { Link } from 'react-router-dom';

const DiagnosticosActuales = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Diagnósticos Actuales</h1>
      <p className="text-gray-600 mb-7">
        Aquí puedes ver todos los diagnósticos que están en curso o activos.
      </p>

      <div className="bg-white p-4 rounded shadow">
        <p>1er diagnóstico actual</p>
        <Link
          to="/diagnosticSummary"
          className="text-blue-600 hover:underline"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default DiagnosticosActuales;
