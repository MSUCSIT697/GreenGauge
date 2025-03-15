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
        navigate("/signin"); // Ensure this redirects
      }

      // ✅ Remove trailing slash from API base URL
      const API_BASE = import.meta.env.VITE_API_URL.replace(/\/$/, "");

      try {
        console.log("Fetching from:", `${API_BASE}/get_user_results`);
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
  const updateResults = async (newResult) => {
    setResults((prevResults) => [newResult, ...prevResults]); // Add new result to the top
  
    // ✅ Fetch latest results from the backend to ensure sync
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_user_results`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("✅ Updated results:", data);
        setResults(data.results); // Replace with fresh results from backend
      } else {
        console.error("🚨 Error updating results:", data.error);
      }
    } catch (error) {
      console.error("🚨 Error fetching latest results:", error);
    }
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
