import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateRecommendations } from "../components/Recommendations";

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState([]);
  const [emissionsHistory, setEmissionsHistory] = useState([]);
  const [hasFetchedResults, setHasFetchedResults] = useState(false); // ✅ Prevent infinite loop
  const navigate = useNavigate();

  // ✅ Fetch stored results from backend ONLY if not already fetched
  const fetchUserResults = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No authentication token found.");
      return;
    }

    if (hasFetchedResults) return; // ✅ Prevent duplicate fetches

    const API_BASE = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");

    try {
      console.log("Fetching from:", `${API_BASE}/get_user_results`);
      const response = await fetch(`${API_BASE}/get_user_results`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Retrieved results:", data);

      if (JSON.stringify(results) !== JSON.stringify(data.results)) {
        setResults(data.results || []);
        setEmissionsHistory(data.results.map((r) => r.total_emissions));
        setHasFetchedResults(true); // ✅ Mark results as fetched
      }
    } catch (error) {
      console.error("🚨 Error fetching user results:", error);
    }
  };

  // ✅ Fetch results ONLY on first mount or refresh
  useEffect(() => {
    fetchUserResults();
  }, []); // ✅ Runs only once when the component mounts

  // ✅ Function to update results dynamically
  const updateResults = async (newResult = null, source = "manual") => {
    if (newResult) {
      const updatedResult = {
        ...newResult,
        source: source || "manual", // ✅ Ensure source is either "manual" or "upload"
        recommendations: generateRecommendations(newResult.emissions),
      };

      setResults((prevResults) => {
        const isDuplicate = prevResults.some((r) => r.create_ts === updatedResult.create_ts);
        return isDuplicate ? prevResults : [updatedResult, ...prevResults];
      });

      setEmissionsHistory((prev) => [...prev, updatedResult.total_emissions]);
      console.log("✅ Updated results and emissions history:", updatedResult);
    }
  };

  return (
    <ResultsContext.Provider value={{ results, updateResults, emissionsHistory, fetchUserResults }}>
      {children}
    </ResultsContext.Provider>
  );
}

// ✅ Custom hook to access results context
export function useResults() {
  return useContext(ResultsContext);
}
