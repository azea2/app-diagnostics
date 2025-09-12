import React, { useState } from "react";
import UploadTranscript from "../components/UploadTranscript";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, X, Plus } from "lucide-react";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Entrevista = () => {
  // Secciones de cabecera (reordenables)
  const [sections, setSections] = useState([
    { id: "s1", label: "Título de la entrevista", value: "", type: "textarea" },
    { id: "s2", label: "Objetivo de la entrevista", value: "", type: "textarea" },
    {
      id: "s3",
      label: "Tipo de entrevista (Cualitativa o Cuantitativa)",
      value: "",
      type: "input",
    },
    { id: "s4", label: "Introducción breve", value: "", type: "textarea" },
  ]);

  // Lugar y fecha (NO reordenables)
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");

  // Preguntas (reordenables, solo pregunta)
  const [qa, setQa] = useState([{ id: "q1", question: "" }]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Reordenar secciones
    if (source.droppableId === "sections" && destination.droppableId === "sections") {
      setSections((prev) => reorder(prev, source.index, destination.index));
    }

    // Reordenar preguntas
    if (source.droppableId === "qaList" && destination.droppableId === "qaList") {
      setQa((prev) => reorder(prev, source.index, destination.index));
    }
  };

  const updateSection = (id, value) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));

  const addSection = () =>
    setSections((prev) => [
      ...prev,
      {
        id: `s${Date.now()}`,
        label: `Sección ${prev.length + 1}`,
        value: "",
        type: "textarea",
      },
    ]);

  const removeSection = (id) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const updateQa = (id, value) =>
    setQa((prev) => prev.map((q) => (q.id === id ? { ...q, question: value } : q)));

  const addQuestion = () =>
    setQa((prev) => [...prev, { id: `q${Date.now()}`, question: "" }]);

  const removeQuestion = (id) =>
    setQa((prev) => prev.filter((q) => q.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { sections, place, date, qa };
    console.log("Datos entrevista:", payload);
    alert("✅ Entrevista registrada");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-6 mx-10 space-y-6"
    >
      <h1 className="text-xl font-bold text-gray-800">Entrevista</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Secciones arriba (reordenables) */}
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
              {sections.map((s, index) => (
                <Draggable draggableId={s.id} index={index} key={s.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="group relative"
                    >
                      {/* Handler de drag */}
                      <span
                        {...provided.dragHandleProps}
                        className="absolute left-0 -ml-6 top-2 text-gray-400 hover:text-gray-600 cursor-grab px-6"
                        title="Arrastrar para reordenar"
                      >
                        <GripVertical size={18} />
                      </span>

                      {/* Botón borrar */}
                      <button
                        type="button"
                        onClick={() => removeSection(s.id)}
                        className="absolute right-0 -mr-2 top-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600"
                        title="Eliminar sección"
                      >
                        <X size={18} />
                      </button>

                      {s.type === "input" ? (
                        <input
                          value={s.value}
                          onChange={(e) => updateSection(s.id, e.target.value)}
                          placeholder={s.label}
                          className="w-full text-center border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2"
                        />
                      ) : (
                        <textarea
                          value={s.value}
                          onChange={(e) => updateSection(s.id, e.target.value)}
                          placeholder={s.label}
                          className="w-full text-center border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 resize-none"
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {/* Lugar y Fecha (fijos) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <input
                  type="text"
                  placeholder="Lugar de la entrevista"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2"
                />
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Agregar sección */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={addSection}
            className="w-60 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700"
          >
            <Plus size={18} /> Agregar sección
          </button>
        </div>

        {/* Preguntas (reordenables) */}
        <div className="pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Preguntas</h2>
          <Droppable droppableId="qaList">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
                {qa.map((item, index) => (
                  <Draggable draggableId={item.id} index={index} key={item.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group relative"
                      >
                        <span
                          {...provided.dragHandleProps}
                          className="absolute left-0 -ml-6 top-2 text-gray-400 hover:text-gray-600 cursor-grab px-6"
                          title="Arrastrar para reordenar"
                        >
                          <GripVertical size={18} />
                        </span>

                        <button
                          type="button"
                          onClick={() => removeQuestion(item.id)}
                          className="absolute right-0 -mr-2 top-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600"
                          title="Eliminar pregunta"
                        >
                          <X size={18} />
                        </button>

                        {/* Solo input de pregunta */}
                        <input
                          type="text"
                          placeholder={`Pregunta ${index + 1}`}
                          value={item.question}
                          onChange={(e) => updateQa(item.id, e.target.value)}
                          className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 mb-3 pl-6"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="pt-3 flex justify-center">
            <button
              type="button"
              onClick={addQuestion}
              className="w-60 inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700"
            >
              <Plus size={18} /> Agregar pregunta
            </button>
          </div>
        </div>
      </DragDropContext>

      {/* Upload y Guardar */}
      <div className="pt-6">
        <UploadTranscript onFileUpload={(file) => console.log("Archivo cargado:", file)} />
      </div>

      <button
        type="submit"
        className="w-100 block mx-auto bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700"
      >
        Guardar Entrevista
      </button>
    </form>
  );
};

export default Entrevista;