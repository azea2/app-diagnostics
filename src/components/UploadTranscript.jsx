import React, { useState } from "react";

const UploadTranscript = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-400 rounded-2xl text-center bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">📄 Subir Transcripción</h2>
      <input
        type="file"
        accept=".txt,.doc,.docx,.pdf"
        onChange={handleFileChange}
        className="hidden"
        id="uploadInput"
      />
      <label
        htmlFor="uploadInput"
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Seleccionar Archivo
      </label>
      {fileName && <p className="mt-3 text-sm text-gray-700">Archivo: {fileName}</p>}
    </div>
  );
};

export default UploadTranscript;