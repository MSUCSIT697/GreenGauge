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
  
    // ✅ Check if results exist in localStorage before calling API
    const storedResults = localStorage.getItem("userResults");
    if (storedResults) {
      console.log("✅ Loading results from localStorage...");
      setResults(JSON.parse(storedResults));
      return;
    }
  
    console.log("Fetching from:", `${import.meta.env.VITE_API_URL}/get_user_results`);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_user_results`, {
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
      console.log("✅ Retrieved results from API:", data);
  
      if (!data.results || data.results.length === 0) {
        console.warn("⚠️ No results found, setting empty state.");
        setResults([]);
        localStorage.setItem("userResults", JSON.stringify([])); // ✅ Ensure localStorage is updated
        return;
      }
  
      if (JSON.stringify(results) !== JSON.stringify(data.results)) {
        setResults(data.results);
        setEmissionsHistory(data.results.map((r) => r.total_emissions));
  
        // ✅ Store results in localStorage
        localStorage.setItem("userResults", JSON.stringify(data.results));
      }
    } catch (error) {
      console.error("🚨 Error fetching user results:", error);
    }
  };
  

  // ✅ Fetch results ONLY on first mount or refresh
  useEffect(() => {
    fetchUserResults();
  }, []); // ✅ Runs only once when the component mounts

  // ✅ Logout function (placed here)
  const logoutUser = () => {
    console.log("🔄 Logging out user...");
    localStorage.removeItem("token");
    localStorage.removeItem("userResults"); // ✅ Clear stored results
    setResults([]);
    setEmissionsHistory([]);
    setHasFetchedResults(false); // ✅ Reset fetch flag
    navigate("/sign-in");
  };

  // ✅ Function to update results dynamically
  const updateResults = async (newResult = null, source = "manual") => {
    if (newResult) {
      const updatedResult = {
        ...newResult,
        source: source || "manual",
        recommendations: generateRecommendations(newResult.emissions),
      };
  
      setResults((prevResults) => {
        const isDuplicate = prevResults.some((r) => r.create_ts === updatedResult.create_ts);
        const updatedResults = isDuplicate ? prevResults : [updatedResult, ...prevResults];
  
        // ✅ Store updated results in localStorage
        localStorage.setItem("userResults", JSON.stringify(updatedResults));
  
        return updatedResults;
      });
  
      setEmissionsHistory((prev) => [...prev, updatedResult.total_emissions]);
  
      // ✅ Reset hasFetchedResults to allow fresh data fetches
      setHasFetchedResults(false);
      console.log("✅ Updated results and emissions history:", updatedResult);
    }
  };
  


  return (
    <ResultsContext.Provider value={{ results, updateResults, emissionsHistory, fetchUserResults, logoutUser }}>
      {children}
    </ResultsContext.Provider>
  );
}

// ✅ Custom hook to access results context
export function useResults() {
  return useContext(ResultsContext);
}
