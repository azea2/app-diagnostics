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
  getBezierPath,
} from 'reactflow';
import 'reactflow/dist/style.css';

// 🗑️ EDGE PERSONALIZADO CON BOTÓN ELIMINAR MEJORADO
const DeletableEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, markerEnd }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    console.log('🗑️ Click en edge:', id);
    
    // 🔒 Bloquear eliminación en vista dual
    if (data?.dualView) {
      console.log('🔒 Eliminación bloqueada en vista dual');
      return;
    }
    
    if (data?.onDelete) {
      console.log('🗑️ Llamando onDelete para:', id);
      data.onDelete(id);
    } else {
      console.log('❌ No hay onDelete function');
    }
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* 🔴 BOTÓN ELIMINAR COMPACTO - Solo visible si no está en vista dual */}
      {!data?.dualView && (
        <foreignObject
          x={labelX - 9}
          y={labelY - 9}
          width="18"
          height="18"
          className="overflow-visible"
        >
          <button
            onClick={onEdgeClick}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-4.5 h-4.5 text-xs font-bold cursor-pointer shadow-md transition-colors flex items-center justify-center"
            title="Eliminar conexión"
            style={{ fontSize: '12px', width: '18px', height: '18px' }}
          >
            ×
          </button>
        </foreignObject>
      )}
    </>
  );
};

// 🌱 EDGE CURVO PARA SOLUCIONES (sin botón eliminar)
const SolutionEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};

// 🎨 COMPONENTE NODO CON FUNCIONALIDADES AVANZADAS
const ProblemaNodeAdvanced = ({ data, selected }) => {
  const [label, setLabel] = useState(data?.label || '');
  
  // 🔄 SINCRONIZAR SOLO AL CAMBIAR EL NODO (evitar bucle infinito)
  useEffect(() => {
    console.log(`🔄 [ProblemaNodeAdvanced] Inicializando/Cambiando nodo ${data?.id} con label: "${data?.label}"`);
    setLabel(data?.label || '');
  }, [data?.id]); // Solo cuando cambia el ID del nodo, no el label

  // 📏 AUTO-RESIZE TEXTAREA AL CARGAR (con límite máximo)
  useEffect(() => {
    const textareas = document.querySelectorAll(`textarea[data-node-id="${data?.id}"]`);
    textareas.forEach(textarea => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 96); // Límite de 96px (6rem)
      textarea.style.height = newHeight + 'px';
    });
  }, [label, data?.id]);
  
  const handleLabelChange = (e) => {
    const newValue = e.target.value;
    console.log(`📝 [ProblemaNodeAdvanced] Usuario cambiando label de ${data?.id}: "${label}" → "${newValue}"`);
    setLabel(newValue);
    if (data?.onLabelChange) {
      data.onLabelChange(data.id, newValue);
    }
  };

  // 🎨 COLORES POR TIPO
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
        return 'bg-purple-500 text-white border-purple-600';
    }
  };


  // 🔒 VERIFICAR SI EL NODO ES EDITABLE
  const isEditable = () => {
    // En vista dual, no es editable
    if (data?.dualView) {
      return false;
    }
    // En vista soluciones, solo el texto es editable, no las posiciones
    return data?.currentView === 'problemas' || data?.currentView === 'soluciones';
  };

  return (
    <div
      className={`relative px-4 py-3 rounded-lg border-2 shadow-lg ${getNodeStyle()} ${
        selected ? 'ring-2 ring-yellow-400' : ''
      }`}
      style={{
        width: '288px',      // 18rem = w-72 forzado
        maxWidth: '320px',   // 20rem = max-w-80 forzado
        minWidth: '288px',   // Asegurar tamaño mínimo
        boxSizing: 'border-box'
      }}
    >
      {/* 🔗 HANDLES UNIVERSALES CON IDs ESPECÍFICOS - Siempre presentes, invisibles en soluciones */}
      <Handle 
        type="target" 
        position={Position.Top}
        id={`${data?.id}-top`}
        className={`w-3 h-3 ${data?.currentView === 'soluciones' ? 'opacity-0 pointer-events-none' : ''}`}
      />
      <Handle 
        type="source" 
        position={Position.Bottom}
        id={`${data?.id}-bottom`}
        className={`w-3 h-3 ${data?.currentView === 'soluciones' ? 'opacity-0 pointer-events-none' : ''}`}
      />
      <Handle 
        type="target" 
        position={Position.Left}
        id={`${data?.id}-left`}
        className={`w-3 h-3 ${data?.currentView === 'soluciones' ? 'opacity-0 pointer-events-none' : ''}`}
      />
      <Handle 
        type="source" 
        position={Position.Right}
        id={`${data?.id}-right`}
        className={`w-3 h-3 ${data?.currentView === 'soluciones' ? 'opacity-0 pointer-events-none' : ''}`}
      />
      
      <div className="text-center">
        <textarea
          value={label}
          onChange={handleLabelChange}
          placeholder={data?.placeholder || 'Texto...'}
          className="bg-transparent text-center outline-none w-full text-sm font-medium placeholder-gray-200 resize-none overflow-y-auto min-h-[1.5rem] max-h-24 break-words"
          readOnly={!isEditable()}
          data-node-id={data?.id}
          style={{
            height: 'auto',
            maxHeight: '6rem' // 96px = 6rem para consistencia
          }}
          onInput={(e) => {
            // Auto-resize textarea based on content with max limit
            e.target.style.height = 'auto';
            const newHeight = Math.min(e.target.scrollHeight, 96); // Límite de 96px
            e.target.style.height = newHeight + 'px';
          }}
        />
      </div>
      
      {/* ❌ BOTÓN ELIMINAR - Solo en vista problemas y nodos no centrales, no en vista dual */}
      {data?.onDelete && 
       data?.currentView === 'problemas' && 
       !data?.dualView &&
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

// ✅ TIPOS DE NODOS Y EDGES FUERA DEL COMPONENTE (EVITA RECREACIÓN)
const nodeTypes = {
  problemaNode: ProblemaNodeAdvanced,
};

const edgeTypes = {
  deletable: DeletableEdge,
  solutionEdge: SolutionEdge,
};

const ArbolDiagramaFixed = () => {
  console.log('🚀 ArbolDiagramaFixed con funcionalidades avanzadas iniciado');

  // 🎯 ESTADOS PRINCIPALES
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  const [currentView, setCurrentView] = useState('problemas'); // 'problemas' | 'soluciones' | 'dual'
  const [diagramName, setDiagramName] = useState('Mi Árbol de Problemas');

  // 🏷️ FUNCIÓN PARA CAMBIAR ETIQUETAS (Solo nodo individual - SIN sincronización de texto)
  const handleLabelChange = useCallback((id, newLabel) => {
    console.log('📝 [handleLabelChange] ENTRADA:', { id, newLabel });
    
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        if (node.id === id) {
          const oldLabel = node.data?.label;
          console.log('📝 [handleLabelChange] Actualizando nodo:', { 
            id, 
            oldLabel, 
            newLabel, 
            tipo: node.data?.tipo,
            changed: oldLabel !== newLabel
          });
          return { ...node, data: { ...node.data, label: newLabel } };
        }
        return node;
      });
      
      // Debug: Verificar que el nodo se actualizó correctamente
      const updatedNode = updatedNodes.find(n => n.id === id);
      console.log('📝 [handleLabelChange] Nodo después de actualizar:', {
        id: updatedNode?.id,
        label: updatedNode?.data?.label,
        placeholder: updatedNode?.data?.placeholder
      });
      
      return updatedNodes;
    });
  }, [setNodes]);

  // ❌ FUNCIÓN PARA ELIMINAR NODOS (Con sincronización)
  const deleteNode = useCallback((id) => {
    // Solo permitir eliminación desde vista problemas
    if (currentView !== 'problemas') return;
    
    setNodes((nds) => {
      // Encontrar el nodo a eliminar y su nodo enlazado
      const nodeToDelete = nds.find(node => node.id === id);
      if (!nodeToDelete) return nds;
      
      const linkedNodeId = nodeToDelete.data.linkedNode;
      
      // Eliminar tanto el nodo problema como su solución enlazada
      const idsToDelete = linkedNodeId ? [id, linkedNodeId] : [id];
      
      const updatedNodes = nds.filter((node) => !idsToDelete.includes(node.id));
      
      // También eliminar los edges relacionados (tanto problema como solución)
      setEdges((eds) => eds.filter((edge) => 
        !idsToDelete.includes(edge.source) && !idsToDelete.includes(edge.target)
      ));
      
      return updatedNodes;
    });
  }, [setNodes, setEdges, currentView]);

  // 🗑️ FUNCIÓN PARA ELIMINAR EDGES
  const deleteEdge = useCallback((edgeId) => {
    console.log('🗑️ INICIANDO ELIMINACIÓN DE EDGE:', edgeId);
    console.log('🗑️ Vista actual:', currentView);
    
    // Solo permitir eliminación desde vista problemas
    if (currentView !== 'problemas') {
      console.log('❌ Eliminación bloqueada - no estamos en vista problemas');
      return;
    }

    setEdges((eds) => {
      console.log('🗑️ Edges antes de eliminar:', eds.map(e => e.id));
      
      // Encontrar el edge a eliminar
      const edgeToDelete = eds.find(e => e.id === edgeId);
      if (!edgeToDelete) {
        console.log('❌ Edge no encontrado:', edgeId);
        return eds;
      }
      
      console.log('✅ Edge encontrado:', edgeToDelete);

      // Si es un edge de problema, también eliminar el edge de solución correspondiente
      let edgesToRemove = [edgeId];
      
      if (edgeId.startsWith('problem-')) {
        // Extraer source y target del ID del problema
        const sourceTarget = edgeId.replace('problem-', '');
        const solutionEdgeId = `solution-${sourceTarget}`;
        edgesToRemove.push(solutionEdgeId);
        console.log('🗑️ También eliminando edge de solución:', solutionEdgeId);
      }

      const newEdges = eds.filter(edge => !edgesToRemove.includes(edge.id));
      console.log('🗑️ Edges después de eliminar:', newEdges.map(e => e.id));
      
      return newEdges;
    });
  }, [setEdges, currentView]);

  // ➕ FUNCIÓN PARA AGREGAR NODOS (Con creación automática de pares)
  const addNode = useCallback((tipo) => {
    // Solo permitir agregar desde vista problemas
    if (currentView !== 'problemas') return;
    
    const newNodeId = `${tipo}-${nodeId}`;
    const position = {
      x: Math.random() * 400 + 200,
      y: tipo === 'efecto' ? Math.random() * 60 + 50 : Math.random() * 60 + 350,
    };

    // 🌱 MAPEO PROBLEMA → SOLUCIÓN
    const solutionMapping = {
      'efecto': 'fin',
      'causa': 'medio',
    };

    const problemLabels = {
      'efecto': 'Efecto...',
      'causa': 'Causa...',
      'problema': 'Problema Central'
    };

    const solutionLabels = {
      'fin': 'Fin...',
      'medio': 'Medio...',
      'objetivo': 'Objetivo Central'
    };

    // Crear nodo del problema
    const problemNode = {
      id: newNodeId,
      type: 'problemaNode',
      position,
      data: {
        id: newNodeId,
        label: problemLabels[tipo],
        placeholder: problemLabels[tipo],
        tipo,
        onLabelChange: handleLabelChange,
        onDelete: deleteNode,
        currentView: 'problemas',
      },
    };

    // 🌱 CREAR AUTOMÁTICAMENTE NODO SOLUCIÓN CORRESPONDIENTE
    const solutionTipo = solutionMapping[tipo];
    const solutionNodeId = `solution-${newNodeId}`; // ARREGLADO: patrón consistente solution-
    const solutionNode = {
      id: solutionNodeId,
      type: 'problemaNode',
      position: { ...position }, // Misma posición
      data: {
        id: solutionNodeId,
        label: solutionLabels[solutionTipo],
        placeholder: solutionLabels[solutionTipo],
        tipo: solutionTipo,
        onLabelChange: handleLabelChange,
        onDelete: null, // No se puede eliminar desde soluciones
        linkedNode: newNodeId, // Enlace al nodo del problema
        currentView: 'soluciones',
      },
    };

    // Agregar enlace inverso
    problemNode.data.linkedNode = solutionNodeId;
    
    console.log('🆕 [addNode] NODOS CREADOS CON IDS ARREGLADOS:');
    console.log('   Problema:', { id: newNodeId, linkedNode: solutionNodeId });
    console.log('   Solución:', { id: solutionNodeId, linkedNode: newNodeId });

    setNodes((nds) => nds.concat([problemNode, solutionNode]));
    setNodeId((id) => id + 1);
  }, [nodeId, handleLabelChange, deleteNode, setNodes, currentView]);

  // 🔗 FUNCIÓN PARA CONECTAR NODOS (Con validación y sincronización)
  const onConnect = useCallback(
    (params) => {
      // Solo permitir conexiones desde vista problemas
      if (currentView !== 'problemas') return;
      
      // 🚫 VALIDACIÓN: Prevenir conexiones causa ↔ efecto
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      // Prevenir causa → efecto o efecto → causa
      if ((sourceNode?.data?.tipo === 'causa' && targetNode?.data?.tipo === 'efecto') ||
          (sourceNode?.data?.tipo === 'efecto' && targetNode?.data?.tipo === 'causa')) {
        console.log('🚫 Conexión no permitida: causa ↔ efecto');
        return;
      }

      // 🎨 COLORES POR TIPO DE CONEXIÓN
      let edgeStyle = {};
      if (sourceNode?.data?.tipo === 'causa' || targetNode?.data?.tipo === 'causa') {
        edgeStyle = { stroke: '#ef4444', strokeWidth: 2 }; // Rojo para causas
      } else if (sourceNode?.data?.tipo === 'efecto' || targetNode?.data?.tipo === 'efecto') {
        edgeStyle = { stroke: '#3b82f6', strokeWidth: 2 }; // Azul para efectos
      }

      // ✅ CREAR CONEXIÓN EN VISTA PROBLEMAS CON BOTÓN ELIMINAR
      const problemEdge = {
        id: `problem-${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || `${params.source}-bottom`, // Handle por defecto
        targetHandle: params.targetHandle || `${params.target}-top`,   // Handle por defecto
        style: edgeStyle,
        type: 'deletable',
        data: {
          onDelete: deleteEdge,
        },
        markerEnd: {
          type: 'arrowclosed',
        },
      };

      console.log('✅ [onConnect] Creando problem edge CON HANDLES:', {
        id: problemEdge.id,
        source: problemEdge.source,
        target: problemEdge.target,
        sourceHandle: problemEdge.sourceHandle,
        targetHandle: problemEdge.targetHandle,
      });

      console.log('🔍 [onConnect] Verificando handles en nodos:');
      console.log(`   Source node (${problemEdge.source}) debería tener handle: ${problemEdge.sourceHandle}`);
      console.log(`   Target node (${problemEdge.target}) debería tener handle: ${problemEdge.targetHandle}`);

      // 🌱 CREAR CONEXIÓN CORRESPONDIENTE EN VISTA SOLUCIONES
      const sourceLinkedId = sourceNode?.data?.linkedNode;
      const targetLinkedId = targetNode?.data?.linkedNode;
      
      console.log('🌱 Buscando nodos enlazados:');
      console.log('   Source node:', sourceNode?.id, '→ linked:', sourceLinkedId);
      console.log('   Target node:', targetNode?.id, '→ linked:', targetLinkedId);
      
      let solutionEdge = null;
      if (sourceLinkedId && targetLinkedId) {
        // Verificar que los nodos enlazados existen
        const sourceLinkedNode = nodes.find(n => n.id === sourceLinkedId);
        const targetLinkedNode = nodes.find(n => n.id === targetLinkedId);
        
        console.log('🔍 Verificando existencia de nodos enlazados:');
        console.log('   Source linked exists:', !!sourceLinkedNode, sourceLinkedId);
        console.log('   Target linked exists:', !!targetLinkedNode, targetLinkedId);
        
        if (sourceLinkedNode && targetLinkedNode) {
          // Colores para soluciones
          let solutionEdgeStyle = {};
          if (sourceNode?.data?.tipo === 'causa' || targetNode?.data?.tipo === 'causa') {
            solutionEdgeStyle = { stroke: '#f97316', strokeWidth: 2 }; // Naranja para medios
          } else if (sourceNode?.data?.tipo === 'efecto' || targetNode?.data?.tipo === 'efecto') {
            solutionEdgeStyle = { stroke: '#22c55e', strokeWidth: 2 }; // Verde para fines
          }

          // 🔄 Sincronizar handles del problem edge al solution edge
          const problemSourceHandle = problemEdge.sourceHandle.split('-').pop(); // Extraer 'bottom', 'top', etc.
          const problemTargetHandle = problemEdge.targetHandle.split('-').pop(); // Extraer 'bottom', 'top', etc.
          
          solutionEdge = {
            id: `solution-${params.source}-${params.target}`,
            source: sourceLinkedId,
            target: targetLinkedId,
            sourceHandle: `${sourceLinkedId}-${problemSourceHandle}`, // 🔄 Mismo handle que problema
            targetHandle: `${targetLinkedId}-${problemTargetHandle}`, // 🔄 Mismo handle que problema
            style: solutionEdgeStyle,
            type: 'solutionEdge', // ✅ Nuevo tipo curvo sin botón eliminar
            markerEnd: {
              type: 'arrowclosed',
            },
          };
          
          console.log('✅ [onConnect] Creando solution edge CON HANDLES SINCRONIZADOS:', {
            id: solutionEdge.id,
            source: solutionEdge.source,
            target: solutionEdge.target,
            type: solutionEdge.type, 
            sourceHandle: solutionEdge.sourceHandle,
            targetHandle: solutionEdge.targetHandle,
            sincronizadoDesde: {
              problemSourceHandle: problemEdge.sourceHandle,
              problemTargetHandle: problemEdge.targetHandle,
            },
            sourceExists: nodes.some(n => n.id === sourceLinkedId),
            targetExists: nodes.some(n => n.id === targetLinkedId)
          });
        } else {
          console.log('❌ No se puede crear solution edge - nodos enlazados no existen');
        }
      } else {
        console.log('❌ No se puede crear solution edge - linkedNode no definido');
      }

      // Agregar ambas conexiones con debugging
      setEdges((eds) => {
        console.log('📌 [onConnect] Agregando edges:');
        console.log('   Problem edge:', problemEdge);
        console.log('   Solution edge:', solutionEdge);
        console.log('   Edges antes:', eds.length);
        
        let newEdges = [...eds, problemEdge];
        if (solutionEdge) {
          newEdges = [...newEdges, solutionEdge];
        }
        
        console.log('   Edges después:', newEdges.length);
        console.log('   Todos los edges:', newEdges.map(e => ({ id: e.id, source: e.source, target: e.target })));
        
        return newEdges;
      });
    },
    [setEdges, nodes, currentView, deleteEdge]
  );

  // 🔄 FUNCIÓN PARA CAMBIAR VISTA (ARREGLADA - sin dependencias circulares)
  const changeView = useCallback((view) => {
    console.log('🔄 CAMBIANDO VISTA A:', view);
    console.log('📊 DEBUGGING BÁSICO:');
    console.log('   Nodos totales:', nodes.length);
    console.log('   Edges totales:', edges.length);
    console.log('   Nodos detalle:', nodes.map(n => `${n.id} (${n.data?.tipo}) -> ${n.data?.linkedNode || 'sin link'}`));
    console.log('   Edges detalle:', edges.map(e => `${e.id}: ${e.source} -> ${e.target}`));
    
    setCurrentView(view);
  }, [nodes, edges]);

  // 📍 FUNCIÓN PARA MANEJAR CAMBIOS DE NODOS CON SINCRONIZACIÓN
  const handleNodesChange = useCallback((changes) => {
    // Aplicar cambios normalmente
    onNodesChange(changes);
    
    // 🔄 SINCRONIZAR POSICIONES: Si es un movimiento en vista problemas
    if (currentView === 'problemas') {
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          // Encontrar el nodo que se movió
          const movedNode = nodes.find(n => n.id === change.id);
          if (movedNode?.data?.linkedNode) {
            // Actualizar posición del nodo enlazado
            setTimeout(() => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === movedNode.data.linkedNode
                    ? { 
                        ...node, 
                        position: { 
                          x: change.position.x, 
                          y: change.position.y 
                        } 
                      }
                    : node
                )
              );
            }, 0);
          }
        }
      });
    }
  }, [onNodesChange, currentView, nodes, setNodes]);

  // 🔗 FUNCIÓN PARA MANEJAR CAMBIOS DE EDGES CON SINCRONIZACIÓN
  const handleEdgesChange = useCallback((changes) => {
    // Aplicar cambios normalmente
    onEdgesChange(changes);
    
    // 🔄 SINCRONIZAR ELIMINACIÓN DE EDGES: Si es eliminación en vista problemas
    if (currentView === 'problemas') {
      changes.forEach((change) => {
        if (change.type === 'remove') {
          // Buscar y eliminar el edge correspondiente en soluciones
          const edgeToRemove = edges.find(e => e.id === change.id);
          if (edgeToRemove && edgeToRemove.id.startsWith('problem-')) {
            // Extraer source y target del ID del problema
            const sourceTarget = edgeToRemove.id.replace('problem-', '');
            const solutionEdgeId = `solution-${sourceTarget}`;
            setTimeout(() => {
              setEdges((eds) => eds.filter(edge => edge.id !== solutionEdgeId));
            }, 0);
          }
        }
      });
    }
  }, [onEdgesChange, currentView, edges, setEdges]);

  // 📊 FILTRAR NODOS SEGÚN VISTA ACTUAL
  const getFilteredNodes = useCallback(() => {
    if (currentView === 'problemas') {
      return nodes.filter(node => 
        node.data.currentView === 'problemas' || 
        ['problema', 'efecto', 'causa'].includes(node.data.tipo)
      );
    } else if (currentView === 'soluciones') {
      return nodes.filter(node => 
        node.data.currentView === 'soluciones' || 
        ['objetivo', 'fin', 'medio'].includes(node.data.tipo)
      );
    }
    return nodes;
  }, [nodes, currentView]);

  // 📊 FILTRAR EDGES SEGÚN VISTA ACTUAL (Con filtrado por vista + nodos)
  const getFilteredEdges = useCallback(() => {
    const filteredNodes = getFilteredNodes();
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    
    console.log('📊 [getFilteredEdges] Vista:', currentView);
    console.log('📊 [getFilteredEdges] Nodos disponibles:', Array.from(nodeIds));
    console.log('📊 [getFilteredEdges] Total edges:', edges.length);
    
    // FILTRADO POR VISTA: Solo mostrar edges que corresponden a la vista actual
    const viewFilteredEdges = edges.filter(edge => {
      if (currentView === 'problemas') {
        // En vista problemas: solo edges que empiecen con 'problem-'
        return edge.id.startsWith('problem-');
      } else if (currentView === 'soluciones') {
        // En vista soluciones: solo edges que empiecen con 'solution-'
        return edge.id.startsWith('solution-');
      }
      return true; // Por defecto, mostrar todos
    });
    
    console.log(`📊 [getFilteredEdges] Edges filtrados por vista: ${viewFilteredEdges.length}/${edges.length}`);
    console.log('📊 [getFilteredEdges] Edges por vista:', viewFilteredEdges.map(e => e.id));
    
    // FILTRADO POR EXISTENCIA DE NODOS
    const validEdges = [];
    
    viewFilteredEdges.forEach(edge => {
      const hasSource = nodeIds.has(edge.source);
      const hasTarget = nodeIds.has(edge.target);
      
      if (hasSource && hasTarget) {
        validEdges.push(edge);
        console.log(`✅ [getFilteredEdges] Edge válido: ${edge.id} (${edge.source} -> ${edge.target})`);
      } else {
        console.warn(`❌ [getFilteredEdges] Edge DESCARTADO: ${edge.id} - source: ${edge.source}(${hasSource}) target: ${edge.target}(${hasTarget})`);
      }
    });
    
    console.log(`📊 [getFilteredEdges] Resultado final: ${validEdges.length}/${edges.length} edges válidos`);
    
    return validEdges;
  }, [edges, getFilteredNodes, currentView]);

  // 💾 FUNCIÓN PARA DESCARGAR DIAGRAMA (Con debug de labels)
  const downloadDiagram = useCallback(() => {
    // 🐛 DEBUG: Verificar labels antes de descargar
    console.log('💾 [downloadDiagram] Verificando labels de nodos antes de descargar:');
    nodes.forEach(node => {
      console.log(`   Nodo ${node.id}: label="${node.data?.label}", placeholder="${node.data?.placeholder}", tipo="${node.data?.tipo}"`);
    });

    const diagramData = {
      name: diagramName,
      nodes: nodes,
      edges: edges,
      timestamp: new Date().toISOString(),
      version: '2.0'
    };

    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${diagramName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log(`💾 Diagrama "${diagramName}" descargado como JSON con ${nodes.length} nodos`);
  }, [nodes, edges, diagramName]);

  // 💾 FUNCIÓN PARA GUARDAR EN DB (localStorage) (Con debug de labels)
  const saveDiagram = useCallback(() => {
    // 🐛 DEBUG: Verificar labels antes de guardar
    console.log('💾 [saveDiagram] Verificando labels de nodos antes de guardar:');
    nodes.forEach(node => {
      console.log(`   Nodo ${node.id}: label="${node.data?.label}", placeholder="${node.data?.placeholder}", tipo="${node.data?.tipo}"`);
    });

    const diagramData = {
      name: diagramName,
      nodes: nodes,
      edges: edges,
      timestamp: new Date().toISOString(),
      version: '2.0'
    };

    // Guardar en localStorage
    const savedDiagrams = JSON.parse(localStorage.getItem('saved_diagrams') || '[]');
    const existingIndex = savedDiagrams.findIndex(d => d.name === diagramName);
    
    if (existingIndex >= 0) {
      savedDiagrams[existingIndex] = diagramData;
    } else {
      savedDiagrams.push(diagramData);
    }
    
    localStorage.setItem('saved_diagrams', JSON.stringify(savedDiagrams));
    console.log(`💾 Diagrama "${diagramName}" guardado en localStorage con ${nodes.length} nodos`);
    alert(`✅ Diagrama "${diagramName}" guardado correctamente`);
  }, [nodes, edges, diagramName]);

  // 📥 FUNCIÓN PARA CARGAR DESDE ARCHIVO
  const loadDiagramFromFile = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📁 [loadDiagramFromFile] Cargando archivo:', file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const diagramData = JSON.parse(e.target.result);
        console.log('📁 [loadDiagramFromFile] Datos cargados:', {
          nombre: diagramData.name,
          totalNodos: diagramData.nodes?.length || 0,
          totalEdges: diagramData.edges?.length || 0,
          tiposDeNodos: diagramData.nodes?.map(n => n.data?.tipo) || []
        });

        setDiagramName(diagramData.name || 'Diagrama Cargado');
        setNodes(diagramData.nodes || []);
        setEdges(diagramData.edges || []);
        setNodeId(Math.max(...(diagramData.nodes?.map(n => parseInt(n.id.split('-')[1]) || 0) || [0])) + 1);
        
        console.log('📁 [loadDiagramFromFile] Estado actualizado correctamente');
        alert(`✅ Diagrama "${diagramData.name}" cargado correctamente`);
      } catch (error) {
        alert('❌ Error al cargar el archivo');
        console.error('Error al cargar diagrama:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  }, [setNodes, setEdges, setNodeId, setDiagramName]);

  // 🚀 INICIALIZACIÓN CON NODOS PROBLEMA Y SOLUCIÓN
  useEffect(() => {
    if (nodes.length === 0) {
      console.log('🎯 Creando nodos iniciales CON PATRÓN ARREGLADO...');
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
            linkedNode: 'solution-central', // ARREGLADO: usar patrón solution- consistente
          },
        },
        {
          id: 'solution-central', // ARREGLADO: usar patrón solution- consistente
          type: 'problemaNode',
          position: { x: 400, y: 200 },
          data: {
            id: 'solution-central', // ARREGLADO
            label: 'Objetivo Central',
            placeholder: 'Objetivo Central',
            tipo: 'objetivo',
            onLabelChange: handleLabelChange,
            onDelete: null,
            linkedNode: 'problema-central',
            currentView: 'soluciones',
          },
        },
      ];
      
      console.log('🎯 NODOS INICIALES CON PATRÓN ARREGLADO:');
      console.log('   Problema central:', { id: 'problema-central', linkedNode: 'solution-central' });
      console.log('   Solución central:', { id: 'solution-central', linkedNode: 'problema-central' });
      
      setNodes(initialNodes);
    }
  }, [nodes.length, handleLabelChange, setNodes]);

  console.log('🎯 Renderizando:', { nodesLength: nodes.length, currentView, filteredNodes: getFilteredNodes().length });

  return (
    <div className="h-screen w-full relative">
      {/* 🏷️ NOMBRE DEL DIAGRAMA */}
      <div className="absolute top-4 left-4 z-50">
        <input
          type="text"
          value={diagramName}
          onChange={(e) => setDiagramName(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold shadow-md"
          placeholder="Nombre del diagrama"
        />
      </div>

      {/* 🔄 SELECTOR DE VISTA */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => changeView('problemas')}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
            currentView === 'problemas'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          🌳 Problemas
        </button>
        <button
          onClick={() => changeView('soluciones')}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
            currentView === 'soluciones'
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          🌱 Soluciones
        </button>
        <button
          onClick={() => changeView('dual')}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-md ${
            currentView === 'dual'
              ? 'bg-purple-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          👁️ Ambos
        </button>
      </div>

      {/* 🎛️ CONTROLES SUPERIORES - Mucho más abajo, fuera del área blanca */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
        {currentView === 'problemas' ? (
          // Controles para vista problemas únicamente
          <div className="flex gap-2">
            <button
              onClick={() => addNode('efecto')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium"
            >
              ➕ Agregar Efecto
            </button>
            <button
              onClick={() => addNode('causa')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium"
            >
              ➕ Agregar Causa
            </button>
          </div>
        ) : currentView === 'dual' ? (
          // Mensaje para vista dual - Solo lectura
          <div className="bg-purple-100 border border-purple-300 rounded-lg px-4 py-2 text-sm text-purple-700 font-medium">
            👁️ Vista dual de solo lectura. Usa "Problemas" para editar la estructura.
          </div>
        ) : (
          // Mensaje para vista soluciones únicamente
          <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2 text-sm text-green-700">
            💡 Vista de solo lectura. Usa "Problemas" para editar estructura.
          </div>
        )}
      </div>

      {/* 💾 CONTROLES DE SAVE/LOAD - Mucho más abajo, fuera del área blanca, solo visibles en vista Problemas */}
      {currentView === 'problemas' && (
        <div className="absolute top-24 left-4 z-50 flex flex-col gap-1">
          <button
            onClick={saveDiagram}
            className="bg-purple-500 hover:bg-purple-600 text-white p-1.5 rounded-md shadow-md text-sm font-medium transition-colors w-8 h-8 flex items-center justify-center"
            title="Guardar diagrama"
          >
            💾
          </button>
          <button
            onClick={downloadDiagram}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-1.5 rounded-md shadow-md text-sm font-medium transition-colors w-8 h-8 flex items-center justify-center"
            title="Descargar diagrama"
          >
            ⬇️
          </button>
          <label className="bg-teal-500 hover:bg-teal-600 text-white p-1.5 rounded-md shadow-md text-sm font-medium cursor-pointer transition-colors w-8 h-8 flex items-center justify-center" title="Cargar diagrama">
            📁
            <input
              type="file"
              accept=".json"
              onChange={loadDiagramFromFile}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* 🌐 REACT FLOW AREA - Vista única o dual */}
      <div className="absolute top-32 left-0 right-0 bottom-0">
        {currentView === 'dual' ? (
          // 👁️ VISTA DUAL - Ambos diagramas lado a lado
          <div className="flex h-full">
            {/* 🌳 PROBLEMAS - Lado izquierdo */}
            <div className="flex-1 relative border-r border-gray-300">
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium z-10">
                🌳 Problemas
              </div>
              <ReactFlow
                nodes={nodes
                  .filter(node => 
                    node.data.currentView === 'problemas' || 
                    ['problema', 'efecto', 'causa'].includes(node.data.tipo)
                  )
                  .map(node => ({
                    ...node,
                    data: { ...node.data, dualView: true }
                  }))}
                edges={edges
                  .filter(edge => edge.id.startsWith('problem-'))
                  .map(edge => ({
                    ...edge,
                    data: { ...edge.data, dualView: true }
                  }))}
                onNodesChange={undefined}
                onEdgesChange={undefined}
                onConnect={undefined}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                fitView={true}
                className="bg-gray-50"
                attributionPosition="bottom-left"
              >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
            </div>
            
            {/* 🌱 SOLUCIONES - Lado derecho */}
            <div className="flex-1 relative">
              <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium z-10">
                🌱 Soluciones
              </div>
              <ReactFlow
                nodes={nodes
                  .filter(node => 
                    node.data.currentView === 'soluciones' || 
                    ['objetivo', 'fin', 'medio'].includes(node.data.tipo)
                  )
                  .map(node => ({
                    ...node,
                    data: { ...node.data, dualView: true }
                  }))}
                edges={edges
                  .filter(edge => edge.id.startsWith('solution-'))
                  .map(edge => ({
                    ...edge,
                    data: { ...edge.data, dualView: true }
                  }))}
                onNodesChange={undefined}
                onEdgesChange={undefined}
                onConnect={undefined}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                fitView={true}
                className="bg-gray-50"
                attributionPosition="bottom-left"
              >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
            </div>
          </div>
        ) : (
          // 📱 VISTA ÚNICA - Diagrama individual
          <ReactFlow
            nodes={getFilteredNodes()}
            edges={getFilteredEdges()}
            onNodesChange={currentView === 'problemas' ? handleNodesChange : undefined}
            onEdgesChange={currentView === 'problemas' ? handleEdgesChange : undefined}
            onConnect={currentView === 'problemas' ? onConnect : undefined}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={currentView === 'problemas'}
            nodesConnectable={currentView === 'problemas'}
            elementsSelectable={true}
            fitView={true}
            className="bg-gray-50"
            onInit={() => console.log('🚀 ReactFlow inicializado correctamente')}
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        )}
      </div>
    </div>
  );
};

export default ArbolDiagramaFixed;
