// 1. Modify UploadModal.jsx to log PDF results
import { useState } from "react";
import { useResults } from "../context/ResultsContext";

export default function UploadModal({ isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { updateResults } = useResults();

  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select a PDF to upload.");
    
    setUploading(true);
    
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/calculate_emissions`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      const reportEntry = {
        id: Date.now(), // Unique ID for tracking
        uploadType: "pdf",
        results: data,
        date: new Date().toLocaleString()
      };
      
      updateResults(reportEntry); // Update global state
      onClose();
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold">Upload PDF</h2>
        <input type="file" onChange={(e) => setFiles([e.target.files[0]])} accept=".pdf" />
        <button className="btn btn-primary" onClick={handleUpload}>
          {uploading ? "Uploading..." : "Upload & Process"}
        </button>
      </div>
    </div>
  );
}
