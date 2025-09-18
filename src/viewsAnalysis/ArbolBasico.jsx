import React from 'react';
import ReactFlow, {
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Sin componentes personalizados - usar nodos por defecto de React Flow
const initialNodes = [
  {
    id: '1',
    position: { x: 250, y: 250 },
    data: { label: 'Problema Central' },
    // Usar tipo por defecto, no personalizado
  },
];

const ArbolBasico = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <h1 style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        React Flow Sin Nodos Personalizados
      </h1>
      <ReactFlow
        nodes={initialNodes}
        edges={[]}
        fitView
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ArbolBasico;
