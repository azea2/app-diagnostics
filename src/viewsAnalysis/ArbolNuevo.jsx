import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Componente de nodo simple y robusto
const ProblemaNode = ({ data }) => {
  const [label, setLabel] = useState(data?.label || '');
  
  const getNodeColor = () => {
    switch (data?.tipo) {
      case 'problema': return 'bg-gray-700 text-white';
      case 'efecto': return 'bg-blue-500 text-white';
      case 'causa': return 'bg-red-500 text-white';
      case 'objetivo': return 'bg-emerald-600 text-white';
      case 'fin': return 'bg-green-500 text-white';
      case 'medio': return 'bg-orange-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg border-2 shadow-lg min-w-48 ${getNodeColor()}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="text-center">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={data?.placeholder || 'Escribir...'}
          className="bg-transparent text-center outline-none w-full text-sm font-medium"
        />
      </div>
    </div>
  );
};

const ArbolNuevo = () => {
  // Memoizar nodeTypes para evitar recreación
  const nodeTypes = useMemo(() => ({
    problemaNode: ProblemaNode,
  }), []);

  // Estado simple sin hooks complejos
  const [nodes, setNodes] = useState([
    {
      id: 'problema-central',
      type: 'problemaNode',
      position: { x: 400, y: 300 },
      data: {
        label: 'Problema Central',
        placeholder: 'Problema Central',
        tipo: 'problema',
      },
    },
  ]);

  const [edges, setEdges] = useState([]);
  const [nodeId, setNodeId] = useState(1);

  // Función simple para agregar nodos
  const addNode = useCallback((tipo) => {
    const newId = `${tipo}-${nodeId}`;
    const position = {
      x: Math.random() * 300 + 200,
      y: tipo === 'efecto' ? 100 : 500,
    };

    const labels = {
      efecto: 'Nuevo Efecto',
      causa: 'Nueva Causa',
    };

    const newNode = {
      id: newId,
      type: 'problemaNode',
      position,
      data: {
        label: labels[tipo],
        placeholder: `${tipo}...`,
        tipo,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
  }, [nodeId]);

  return (
    <div className="relative w-full h-screen">
      {/* Controles simples */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => addNode('efecto')}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          + Efecto
        </button>
        <button
          onClick={() => addNode('causa')}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          + Causa
        </button>
      </div>

      {/* React Flow simplificado */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ArbolNuevo;
