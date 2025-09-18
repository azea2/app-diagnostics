import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Componente de nodo simple
const SimpleNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded bg-white border-2 border-stone-400">
      <Handle type="target" position={Position.Top} />
      <div>
        <label>{data.label}</label>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// ✅ MOVER FUERA DEL COMPONENTE - Evita re-creación en cada render
const nodeTypes = {
  simpleNode: SimpleNode,
};

const ArbolDiagramaSimple = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: '1',
      type: 'simpleNode',
      position: { x: 250, y: 250 },
      data: { label: 'Problema Central' },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ArbolDiagramaSimple;
