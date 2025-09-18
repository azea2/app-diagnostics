import React, { useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Nodo extremadamente simple
const TestNode = ({ data }) => {
  return (
    <div style={{
      padding: '10px',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '5px',
      minWidth: '150px',
      textAlign: 'center'
    }}>
      <Handle type="target" position={Position.Top} />
      <div>{data?.label || 'Test Node'}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const ArbolTest = () => {
  // Memoizar nodeTypes para evitar recreación
  const nodeTypes = useMemo(() => ({
    testNode: TestNode,
  }), []);

  // Memoizar nodos iniciales
  const initialNodes = useMemo(() => [
    {
      id: '1',
      type: 'testNode',
      position: { x: 250, y: 250 },
      data: { label: 'Problema Central' },
    },
  ], []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <h1 style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        Test React Flow
      </h1>
      <ReactFlow
        nodes={initialNodes}
        edges={[]}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ArbolTest;
