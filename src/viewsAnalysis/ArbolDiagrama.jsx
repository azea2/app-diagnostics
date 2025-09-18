import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Componente personalizado para nodos de problemas
const ProblemaNode = ({ data, selected }) => {
  const [label, setLabel] = useState(data?.label || '');
  
  const handleLabelChange = (e) => {
    const newValue = e.target.value;
    setLabel(newValue);
    if (data?.onLabelChange && typeof data.onLabelChange === 'function') {
      data.onLabelChange(data.id, newValue);
    }
  };

  const getNodeStyle = () => {
    switch (data?.tipo) {
      case 'efecto':
        return 'bg-blue-500 text-white border-blue-600';
      case 'fin':
        return 'bg-green-500 text-white border-green-600';
      case 'problema':
        return 'bg-gray-700 text-white border-gray-800';
      case 'objetivo':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'causa':
        return 'bg-red-500 text-white border-red-600';
      case 'medio':
        return 'bg-orange-500 text-white border-orange-600';
      default:
        return 'bg-gray-400 text-white border-gray-500';
    }
  };

  // Verificar que tenemos datos válidos
  if (!data) {
    return <div className="bg-red-500 text-white p-2 rounded">Error: No data</div>;
  }

  return (
    <div
      className={`relative px-4 py-3 rounded-lg border-2 shadow-lg min-w-48 max-w-64 ${getNodeStyle()} ${
        selected ? 'ring-2 ring-yellow-400' : ''
      }`}
    >
      {/* Handles para conexiones */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="text-center">
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          onFocus={(e) => {
            if (e.target.value === data?.placeholder) {
              setLabel('');
            }
          }}
          placeholder={data?.placeholder || 'Texto...'}
          className="bg-transparent text-center outline-none w-full text-sm font-medium placeholder-gray-200"
        />
      </div>
      
      {/* Botón eliminar - Solo visible en problemas y para nodos no centrales */}
      {data?.onDelete && 
       data?.currentView === 'problemas' && 
       !['problema', 'objetivo'].includes(data?.tipo) && (
        <button
          onClick={() => data.onDelete(data.id)}
          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 text-xs"
        >
          ×
        </button>
      )}
    </div>
  );
};

const ArbolDiagrama = () => {
  console.log('🚀 ArbolDiagrama renderizado');

  // ✅ MEMOIZAR TIPOS DE NODOS - Evita re-creación
  const nodeTypes = useMemo(() => {
    console.log('📦 Creando nodeTypes');
    const types = {
      problemaNode: ProblemaNode,
    };
    console.log('📦 nodeTypes creado:', types);
    return types;
  }, []);

  // ✅ INICIALIZAR VACÍO Y LLENAR DESPUÉS
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Función para cambiar etiquetas
  const handleLabelChange = useCallback((id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // ✅ INICIALIZAR NODOS DESPUÉS DE QUE TODO ESTÉ LISTO
  useEffect(() => {
    console.log('🎯 useEffect inicialization - nodes.length:', nodes.length, 'isInitialized:', isInitialized);
    
    if (nodes.length === 0 && !isInitialized && nodeTypes && handleLabelChange) {
      console.log('🎯 Creando nodos iniciales...');
      
      const initialNodes = [
        {
          id: 'problema-central',
          type: 'problemaNode',
          position: { x: 400, y: 200 },
          data: {
            id: 'problema-central',
            label: 'Problema Central',
            placeholder: 'Problema Central',
            tipo: 'problema',
            onLabelChange: handleLabelChange,
            onDelete: null,
            currentView: 'problemas',
            linkedNode: 'objetivo-central',
          },
        },
        {
          id: 'objetivo-central',
          type: 'problemaNode',
          position: { x: 400, y: 200 },
          data: {
            id: 'objetivo-central',
            label: 'Objetivo Central',
            placeholder: 'Objetivo Central',
            tipo: 'objetivo',
            onLabelChange: handleLabelChange,
            onDelete: null,
            currentView: 'soluciones',
            linkedNode: 'problema-central',
          },
        },
      ];
      
      console.log('🎯 Nodos creados:', initialNodes);
      setNodes(initialNodes);
      setIsInitialized(true);
    }
  }, [nodes.length, handleLabelChange, nodeTypes, isInitialized]);
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  const [diagramName, setDiagramName] = useState('Mi Árbol de Problemas');
  const [currentView, setCurrentView] = useState('problemas'); // 'problemas', 'soluciones', 'ambos'


  // Función para eliminar nodos
  const deleteNode = useCallback((id) => {
    // Solo permitir eliminación desde vista problemas
    if (currentView !== 'problemas') return;
    
    setNodes((nds) => {
      // Encontrar el nodo a eliminar y su nodo enlazado
      const nodeToDelete = nds.find(node => node.id === id);
      if (!nodeToDelete) return nds;
      
      const linkedNodeId = nodeToDelete.data.linkedNode;
      
      // Eliminar tanto el nodo como su enlazado
      const idsToDelete = linkedNodeId ? [id, linkedNodeId] : [id];
      
      const updatedNodes = nds.filter((node) => !idsToDelete.includes(node.id));
      
      // También eliminar los edges relacionados
      setEdges((eds) => eds.filter((edge) => 
        !idsToDelete.includes(edge.source) && !idsToDelete.includes(edge.target)
      ));
      
      return updatedNodes;
    });
  }, [setNodes, setEdges, currentView]);

  // Función para agregar nodos (solo desde vista problemas)
  const addNode = useCallback((tipo) => {
    if (currentView !== 'problemas') return;
    
    const newNodeId = `${tipo}-${nodeId}`;
    
    let yPosition;
    switch (tipo) {
      case 'efecto':
        yPosition = Math.random() * 60 + 50;
        break;
      case 'causa':
        yPosition = Math.random() * 60 + 350;
        break;
      default:
        yPosition = 200;
    }
    
    const position = {
      x: Math.random() * 400 + 200,
      y: yPosition,
    };

    // Mapeo de tipos problema -> solución
    const solutionMapping = {
      'efecto': 'fin',
      'causa': 'medio',
      'problema': 'objetivo'
    };

    const problemLabels = {
      'efecto': 'Nuevo Efecto',
      'causa': 'Nueva Causa',
      'problema': 'Problema Central'
    };

    const solutionLabels = {
      'fin': 'Nuevo Fin',
      'medio': 'Nuevo Medio', 
      'objetivo': 'Objetivo Central'
    };

    const problemPlaceholders = {
      'efecto': 'Efecto...',
      'causa': 'Causa...',
      'problema': 'Problema...'
    };

    const solutionPlaceholders = {
      'fin': 'Fin...',
      'medio': 'Medio...',
      'objetivo': 'Objetivo...'
    };

    // Crear nodo del problema
    const problemNode = {
      id: newNodeId,
      type: 'problemaNode',
      position,
      data: {
        id: newNodeId,
        label: problemLabels[tipo],
        placeholder: problemPlaceholders[tipo],
        tipo,
        onLabelChange: handleLabelChange,
        onDelete: deleteNode,
        currentView: 'problemas',
      },
    };

    // Crear nodo de solución correspondiente
    const solutionTipo = solutionMapping[tipo];
    const solutionNodeId = `${solutionTipo}-${nodeId}`;
    const solutionNode = {
      id: solutionNodeId,
      type: 'problemaNode',
      position: { ...position }, // Misma posición
      data: {
        id: solutionNodeId,
        label: solutionLabels[solutionTipo],
        placeholder: solutionPlaceholders[solutionTipo],
        tipo: solutionTipo,
        onLabelChange: handleLabelChange,
        onDelete: deleteNode,
        linkedNode: newNodeId, // Enlace al nodo del problema
        currentView: 'soluciones',
      },
    };

    // Agregar enlace inverso
    problemNode.data.linkedNode = solutionNodeId;

    setNodes((nds) => nds.concat([problemNode, solutionNode]));
    setNodeId((id) => id + 1);
  }, [nodeId, deleteNode, currentView, handleLabelChange]);

  // Función para descargar el diagrama
  const downloadDiagram = useCallback(() => {
    const diagramData = {
      name: diagramName,
      nodes: nodes,
      edges: edges,
      nodeId: nodeId,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${diagramName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Diagrama descargado exitosamente');
  }, [nodes, edges, nodeId, diagramName]);

  // Función para guardar en base de datos (simulado por ahora)
  const saveDiagram = useCallback(() => {
    const diagramData = {
      name: diagramName,
      nodes: nodes,
      edges: edges,
      nodeId: nodeId,
      timestamp: new Date().toISOString(),
      id: `diagram_${Date.now()}`, // ID único para el diagrama
    };
    
    // Por ahora guardar en localStorage simulando base de datos
    const savedDiagrams = JSON.parse(localStorage.getItem('saved_diagrams') || '[]');
    
    // Verificar si ya existe un diagrama con el mismo nombre
    const existingIndex = savedDiagrams.findIndex(d => d.name === diagramName);
    
    if (existingIndex >= 0) {
      // Actualizar diagrama existente
      savedDiagrams[existingIndex] = diagramData;
      alert(`Diagrama "${diagramName}" actualizado en la base de datos`);
    } else {
      // Agregar nuevo diagrama
      savedDiagrams.push(diagramData);
      alert(`Diagrama "${diagramName}" guardado en la base de datos`);
    }
    
    localStorage.setItem('saved_diagrams', JSON.stringify(savedDiagrams));
    
    // TODO: Aquí se conectará a la API de la base de datos en el futuro
    // await fetch('/api/diagrams', { method: 'POST', body: JSON.stringify(diagramData) });
    
  }, [nodes, edges, nodeId, diagramName]);

  // Función para cargar diagrama desde archivo
  const loadDiagramFromFile = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const diagramData = JSON.parse(e.target.result);
        setNodes(diagramData.nodes || []);
        setEdges(diagramData.edges || []);
        setNodeId(diagramData.nodeId || 1);
        setDiagramName(diagramData.name || 'Diagrama Cargado');
        alert('Diagrama cargado exitosamente desde archivo');
      } catch (error) {
        alert('Error al cargar el archivo. Asegúrate de que sea un archivo válido.');
      }
    };
    reader.readAsText(file);
  }, [setNodes, setEdges]);

  // Función para cargar diagrama desde base de datos
  const loadDiagramFromDB = useCallback(() => {
    const savedDiagrams = JSON.parse(localStorage.getItem('saved_diagrams') || '[]');
    
    if (savedDiagrams.length === 0) {
      alert('No hay diagramas guardados en la base de datos');
      return;
    }
    
    // Crear una lista de opciones
    const diagramList = savedDiagrams.map((d, index) => 
      `${index + 1}. ${d.name} (${new Date(d.timestamp).toLocaleDateString()})`
    ).join('\n');
    
    const selection = prompt(`Selecciona un diagrama para cargar:\n\n${diagramList}\n\nIngresa el número:`);
    
    if (selection && !isNaN(selection)) {
      const index = parseInt(selection) - 1;
      if (index >= 0 && index < savedDiagrams.length) {
        const selectedDiagram = savedDiagrams[index];
        setNodes(selectedDiagram.nodes || []);
        setEdges(selectedDiagram.edges || []);
        setNodeId(selectedDiagram.nodeId || 1);
        setDiagramName(selectedDiagram.name || 'Diagrama Cargado');
        alert(`Diagrama "${selectedDiagram.name}" cargado exitosamente desde la base de datos`);
      } else {
        alert('Selección inválida');
      }
    }
  }, [setNodes, setEdges]);

  // Función para filtrar nodos según la vista actual
  const getFilteredNodes = useCallback(() => {
    if (currentView === 'problemas') {
      return nodes.filter(node => ['efecto', 'causa', 'problema'].includes(node.data.tipo));
    } else if (currentView === 'soluciones') {
      return nodes.filter(node => ['fin', 'medio', 'objetivo'].includes(node.data.tipo));
    } else if (currentView === 'ambos') {
      // En vista ambos, mostramos todos los nodos pero en posiciones separadas
      return nodes.map(node => {
        if (['fin', 'medio', 'objetivo'].includes(node.data.tipo)) {
          // Nodos de solución se mueven hacia la derecha
          return {
            ...node,
            position: {
              x: node.position.x + 800, // Desplazar 800px a la derecha
              y: node.position.y
            }
          };
        }
        return node; // Nodos de problema mantienen su posición
      });
    }
    return nodes;
  }, [nodes, currentView]);

  // Función para filtrar edges según la vista actual
  const getFilteredEdges = useCallback(() => {
    const filteredNodes = getFilteredNodes();
    const filteredNodeIds = filteredNodes.map(node => node.id);
    return edges.filter(edge => 
      filteredNodeIds.includes(edge.source) && filteredNodeIds.includes(edge.target)
    );
  }, [edges, getFilteredNodes]);


  // Función para manejar cambios de nodos con sincronización de posiciones
  const handleNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      let updatedNodes = [...nds];
      
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          // Encontrar el nodo que se está moviendo
          const nodeIndex = updatedNodes.findIndex(n => n.id === change.id);
          if (nodeIndex !== -1) {
            const node = updatedNodes[nodeIndex];
            
            // En vista ambos, solo permitir mover nodos de problema (lado izquierdo)
            if (currentView === 'ambos' && ['fin', 'medio', 'objetivo'].includes(node.data.tipo)) {
              return; // No permitir mover nodos de solución directamente
            }
            
            // Actualizar la posición del nodo actual
            updatedNodes[nodeIndex] = {
              ...node,
              position: change.position
            };
            
            // Si tiene un nodo enlazado, sincronizar su posición también
            if (node.data.linkedNode) {
              const linkedNodeIndex = updatedNodes.findIndex(n => n.id === node.data.linkedNode);
              if (linkedNodeIndex !== -1) {
                updatedNodes[linkedNodeIndex] = {
                  ...updatedNodes[linkedNodeIndex],
                  position: { ...change.position } // Misma posición
                };
              }
            }
          }
        } else {
          // Para otros tipos de cambios, usar el comportamiento por defecto
          const nodeIndex = updatedNodes.findIndex(n => n.id === change.id);
          if (nodeIndex !== -1) {
            updatedNodes[nodeIndex] = { ...updatedNodes[nodeIndex], ...change };
          }
        }
      });
      
      return updatedNodes;
    });
  }, [setNodes, currentView]);

  // Función para cambiar vista
  const changeView = useCallback((view) => {
    setCurrentView(view);
  }, []);

  // Función para conectar nodos con validación de tipos
  const onConnect = useCallback(
    (params) => {
      // Solo permitir conexiones en vista de problemas o en lado izquierdo de vista ambos
      if (currentView === 'soluciones') {
        alert('Las conexiones solo se pueden crear en la vista de problemas');
        return;
      }

      const sourceNode = nodes.find(node => node.id === params.source);
      const targetNode = nodes.find(node => node.id === params.target);
      
      const sourceType = sourceNode?.data.tipo;
      const targetType = targetNode?.data.tipo;
      
      // Validar que sean nodos de problema (no de solución)
      if (!['efecto', 'causa', 'problema'].includes(sourceType) || 
          !['efecto', 'causa', 'problema'].includes(targetType)) {
        if (currentView === 'ambos') {
          alert('Solo puedes conectar nodos en el lado de problemas (izquierda)');
        }
        return;
      }
      
      // En árbol de problemas: causas no se conectan directamente con efectos
      if ((sourceType === 'causa' && targetType === 'efecto') || 
          (sourceType === 'efecto' && targetType === 'causa')) {
        alert('En el árbol de problemas, las causas no se conectan directamente con los efectos');
        return;
      }

      // Determinar color de la línea según el tipo de nodo origen
      let edgeStyle = { animated: true };
      switch (sourceType) {
        case 'causa':
          edgeStyle.style = { stroke: '#dc2626', strokeWidth: 2 }; // Rojo para causas
          break;
        case 'efecto':
          edgeStyle.style = { stroke: '#2563eb', strokeWidth: 2 }; // Azul para efectos
          break;
        case 'problema':
        default:
          edgeStyle.style = { stroke: '#6b7280', strokeWidth: 2 }; // Gris para problema central
      }

      // Crear la conexión en el árbol de problemas
      const problemEdge = { ...params, ...edgeStyle };
      
      // Crear la conexión correspondiente en el árbol de soluciones
      const sourceLinkedNode = sourceNode?.data.linkedNode;
      const targetLinkedNode = targetNode?.data.linkedNode;
      
      let solutionEdge = null;
      if (sourceLinkedNode && targetLinkedNode) {
        let solutionEdgeStyle = { animated: true };
        
        // Determinar color para soluciones basado en el tipo de nodo fuente
        if (sourceType === 'causa') {
          solutionEdgeStyle.style = { stroke: '#f59e0b', strokeWidth: 2 }; // Naranja para medios
        } else if (sourceType === 'efecto') {
          solutionEdgeStyle.style = { stroke: '#10b981', strokeWidth: 2 }; // Verde para fines
        } else {
          solutionEdgeStyle.style = { stroke: '#059669', strokeWidth: 2 }; // Verde oscuro para objetivo
        }
        
        solutionEdge = {
          id: `${sourceLinkedNode}-${targetLinkedNode}`,
          source: sourceLinkedNode,
          target: targetLinkedNode,
          ...solutionEdgeStyle
        };
      }

      setEdges((eds) => {
        let newEdges = addEdge(problemEdge, eds);
        if (solutionEdge) {
          newEdges = addEdge(solutionEdge, newEdges);
        }
        return newEdges;
      });
    },
    [setEdges, nodes, currentView]
  );

  // 🛡️ RENDERIZADO DEFENSIVO - Solo mostrar cuando todo esté listo
  console.log('🎯 Verificando estado antes de renderizar:', {
    nodeTypes: !!nodeTypes,
    problemaNodeType: !!nodeTypes?.problemaNode,
    nodesLength: nodes.length,
    isInitialized
  });

  if (!nodeTypes || !nodeTypes.problemaNode) {
    console.log('❌ nodeTypes no está listo');
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando componentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      {/* Campo de nombre del diagrama */}
      <div className="absolute top-4 left-4 z-50">
        <input
          type="text"
          value={diagramName}
          onChange={(e) => setDiagramName(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-md"
          placeholder="Nombre del diagrama"
        />
      </div>

      {/* Indicador de vista actual */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-md">
          <span className="font-semibold">
            {currentView === 'problemas' ? '🌳 Árbol de Problemas' : 
             currentView === 'soluciones' ? '🌱 Árbol de Soluciones' : 
             '🔄 Vista Comparativa'}
          </span>
        </div>
      </div>

      {/* Botones principales en la parte superior */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
        {/* Botones de agregar nodos (solo en vista problemas) */}
        {currentView === 'problemas' && (
          <>
            <button
              onClick={() => addNode('efecto')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-lg text-xs font-medium"
            >
              + Efecto
            </button>
            <button
              onClick={() => addNode('causa')}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow-lg text-xs font-medium"
            >
              + Causa
            </button>
            
            {/* Separador */}
            <div className="w-px bg-gray-300 mx-1"></div>
          </>
        )}
        
        {/* Instrucción para vista soluciones */}
        {currentView === 'soluciones' && (
          <>
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-xs font-medium">
              📝 Solo puedes editar los textos en esta vista
            </div>
            
            {/* Separador */}
            <div className="w-px bg-gray-300 mx-1"></div>
          </>
        )}
        
        {/* Instrucción para vista ambos */}
        {currentView === 'ambos' && (
          <>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md text-xs font-medium">
              🔄 Vista comparativa: Problemas (izquierda) y Soluciones (derecha)
            </div>
            
            {/* Separador */}
            <div className="w-px bg-gray-300 mx-1"></div>
          </>
        )}
        
        {/* Botones de vista */}
        <button
          onClick={() => changeView('problemas')}
          className={`px-2 py-1 rounded-md shadow-lg text-xs font-medium ${
            currentView === 'problemas' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          🌳 Problemas
        </button>
        
        <button
          onClick={() => changeView('soluciones')}
          className={`px-2 py-1 rounded-md shadow-lg text-xs font-medium ${
            currentView === 'soluciones' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          🌱 Soluciones
        </button>
        
        <button
          onClick={() => changeView('ambos')}
          className={`px-2 py-1 rounded-md shadow-lg text-xs font-medium ${
            currentView === 'ambos' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          🔄 Ver Ambos
        </button>
        
        {/* Separador */}
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Botones de archivo */}
        <button
          onClick={saveDiagram}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded-md shadow-lg text-xs font-medium"
        >
          💾 Guardar
        </button>
        <button
          onClick={downloadDiagram}
          className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded-md shadow-lg text-xs font-medium"
        >
          📥 Descargar
        </button>
        <label className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md shadow-lg text-xs font-medium cursor-pointer">
          📁 Cargar
          <input
            type="file"
            accept=".json"
            onChange={loadDiagramFromFile}
            className="hidden"
          />
        </label>
      </div>

      {/* Etiquetas para vista comparativa */}
      {currentView === 'ambos' && (
        <>
          <div className="absolute top-24 left-8 z-40">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
              🌳 Árbol de Problemas
            </div>
          </div>
          
          <div className="absolute top-24 right-8 z-40">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
              🌱 Árbol de Soluciones
            </div>
          </div>
          
          {/* Línea divisora */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 h-full z-30"></div>
        </>
      )}

      <div className="absolute top-16 left-0 right-0 bottom-0">
        <ReactFlow
          nodes={getFilteredNodes()}
          edges={getFilteredEdges()}
          onNodesChange={currentView === 'problemas' || currentView === 'ambos' ? handleNodesChange : onNodesChange}
          onEdgesChange={currentView === 'problemas' || currentView === 'ambos' ? onEdgesChange : undefined}
          onConnect={currentView === 'problemas' || currentView === 'ambos' ? onConnect : undefined}
          nodeTypes={nodeTypes}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          fitView={true}
          className="bg-gray-50"
          onInit={() => console.log('🚀 ReactFlow inicializado con nodeTypes:', nodeTypes)}
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ArbolDiagrama;
