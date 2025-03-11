import React, { createContext, useContext, useState, useEffect } from "react";

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState([]);

  // ✅ Fetch stored results from the backend on user login
  useEffect(() => {
    const fetchUserResults = async () => {
      const token = localStorage.getItem("token"); // Ensure we have the user's JWT token
      if (!token) return; // No user logged in

      try {
        const response = await fetch("/api/get_user_results", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user results");
        }

        const data = await response.json();
        setResults(data.results || []); // Store fetched results in context
      } catch (error) {
        console.error("Error fetching user results:", error);
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
