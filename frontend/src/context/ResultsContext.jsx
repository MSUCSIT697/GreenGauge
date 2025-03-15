import React, { createContext, useContext, useState, useEffect } from "react";

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState([]);

  // ✅ Fetch stored results from the backend on user login
  useEffect(() => {
    const fetchUserResults = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No authentication token found.");
        return;
      }

      // ✅ Remove trailing slash from API base URL
      const API_BASE = import.meta.env.VITE_API_URL.replace(/\/$/, "");

      try {
        const response = await fetch(`${API_BASE}/get_user_results`, {
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
        setResults(data);
      } catch (error) {
        console.error("🚨 Error fetching user results:", error);
      }
    };

    fetchUserResults();
  }, []); // Runs only once on component mount

  // ✅ Function to update results in the state dynamically
  const updateResults = (newResult) => {
    setResults((prevResults) => [newResult, ...prevResults]); // Adds new results at the top
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
