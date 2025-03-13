import React, { createContext, useContext, useState, useEffect } from "react";

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState([]);

  // ✅ Fetch stored results from the backend on user login
  useEffect(() => {
    const fetchUserResults = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("⚠️ No authentication token found. User may not be logged in.");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get_user_results`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          console.warn("⚠️ Unauthorized: User must log in.");
          return;
        }

        if (response.status === 404) {
          console.warn("⚠️ No results found for this user.");
          setResults([]); // Set results to empty array instead of crashing
          return;
        }

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
  }, []);

  const updateResults = (newResult) => {
    setResults((prevResults) => [newResult, ...prevResults]); // Stores new results at the top
  };

  return (
    <ResultsContext.Provider value={{ results, updateResults }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  return useContext(ResultsContext);
}
