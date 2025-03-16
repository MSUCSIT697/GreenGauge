import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // ✅ Function to fetch stored results from the backend
  const fetchUserResults = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No authentication token found.");
      return;
    }

    const API_BASE = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");

    try {
      console.log("Fetching from:", `${API_BASE}/api/get_user_results`);
      const response = await fetch(`${API_BASE}/api/get_user_results`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Retrieved results:", data);
      setResults(data.results || []);
    } catch (error) {
      console.error("🚨 Error fetching user results:", error);
    }
  };

  // ✅ Fetch results on mount if user is logged in
  useEffect(() => {
    fetchUserResults();
  }, []); 

  // ✅ Function to update results dynamically
  const updateResults = async (newResult = null) => {
    if (newResult) {
      setResults((prevResults) => [newResult, ...prevResults]); // Adds new result to the top
    }
  
    // ✅ Fetch latest results from the backend
    await fetchUserResults();
  };

  return (
    <ResultsContext.Provider value={{ results, updateResults }}>
      {children}
    </ResultsContext.Provider>
  );
}

// ✅ Custom hook to access results context
export function useResults() {
  return useContext(ResultsContext);
}
