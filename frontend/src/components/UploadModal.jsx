// 1. Modify UploadModal.jsx to log PDF results
import { useState } from "react";
import { useResults } from "../context/ResultsContext";

export default function UploadModal({ isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { updateResults } = useResults();
  const [popupMessage, setPopupMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select a PDF to upload.");
    
    setUploading(true);
    
    const formData = new FormData();
    files.forEach((file) => formData.append("pdf", file));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ PDF upload successful:", data.data);

        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No authentication token found. Redirecting to sign-in.");
          navigate("/signin");
          return;
        }

        const api_response = await fetch(`${import.meta.env.VITE_API_URL}/calculate_emissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data.data),
        });
    
        const emission_response = await api_response.json();
    
        if (api_response.ok) {
          console.log("✅ Calculation successful:", emission_response);
    
          // ✅ Update the results in context
          updateResults(emission_response);
    
          // ✅ Show success message
          setPopupMessage("✅ Calculation submitted successfully!");
          setSuccessModal(true);
        } else {
          console.error("🚨 Calculation failed:", emission_response.error);
          setPopupMessage("❌ Failed to calculate emissions. Please try again.");
          setErrorModal(true);
        }
      }
      
      const reportEntry = {
        id: Date.now(), // Unique ID for tracking
        uploadType: "pdf",
        results: data,
        date: new Date().toLocaleString()
      };
      
      updateResults(reportEntry); // Update global state
      onClose();
    } catch (error) {
      console.error("🚨 Error uploading PDF:", error);
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
