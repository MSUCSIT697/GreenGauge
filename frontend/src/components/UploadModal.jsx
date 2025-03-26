// 1. Modify UploadModal.jsx to log PDF results
import { useState } from "react";
import { useResults } from "../context/ResultsContext";
import { useNavigate } from "react-router-dom";

export default function UploadModal({ isOpen, onClose }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { updateResults } = useResults();
  const [popupMessage, setPopupMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select a PDF to upload.");
      return;
    }
  
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("pdf", file));
  
    try {
      // ✅ Upload the PDF file to the server
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "PDF upload failed.");
      }
  
      console.log("✅ PDF upload successful:", data.data);
  
      // ✅ Get authentication token
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No authentication token found. Redirecting to sign-in.");
        navigate("/signin");
        return;
      }
  
      // ✅ Send the uploaded data for emission calculation
      const api_response = await fetch(`${import.meta.env.VITE_API_URL}/calculate_emissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data.data),
      });
  
      const emission_response = await api_response.json();
  
      if (!api_response.ok) {
        throw new Error(emission_response.error || "Failed to calculate emissions.");
      }
  
      console.log("✅ Calculation successful:", emission_response);
  
      // ✅ Ensure the new result has a timestamp
      const finalResult = {
        ...emission_response,
        create_ts: new Date().toISOString(), // Ensure a unique timestamp
        source: "upload",
      };
  
      // ✅ Store result and update state
      const storedResults = JSON.parse(localStorage.getItem("userResults")) || [];
      const updatedResults = [finalResult, ...storedResults];
      localStorage.setItem("userResults", JSON.stringify(updatedResults));
      updateResults(updatedResults);
  
      console.log("✅ Stored updated results:", updatedResults);
  
      // ✅ Show success message
      setPopupMessage("✅ Calculation submitted successfully!");
      setSuccessModal(true);
  
      // ✅ Redirect to the new result page
      navigate(`/results/${finalResult.create_ts}`);
    } catch (error) {
      console.error("🚨 Error during upload and calculation:", error);
      setPopupMessage(`❌ ${error.message}`);
      setErrorModal(true);
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
