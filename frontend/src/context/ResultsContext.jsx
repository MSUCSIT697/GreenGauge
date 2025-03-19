import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateRecommendations } from "../components/Recommendations";

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState([]);
  const [emissionsHistory, setEmissionsHistory] = useState([]);
  const [hasFetchedResults, setHasFetchedResults] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // ✅ Prevents multiple API calls
  const navigate = useNavigate();

  // ✅ Logout function moved above fetchUserResults()
  const logoutUser = () => {
    console.log("🔄 Logging out user...");
    localStorage.removeItem("token");
    localStorage.removeItem("userResults"); // ✅ Clear stored results
    setResults([]);
    setEmissionsHistory([]);
    setHasFetchedResults(false); // ✅ Reset fetch flag
    navigate("/sign-in");
  };

  // ✅ Fetch stored results from backend
  const fetchUserResults = async () => {
    if (hasFetchedResults || isFetching) return; // ✅ Prevent duplicate fetches
    setIsFetching(true);

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No authentication token found.");
      navigate("/sign-in"); // ✅ Redirect to login if no token
      setIsFetching(false);
      return;
    }

    const API_BASE = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, ""); 
    const url = `${API_BASE}/get_user_results`.replace(/([^:]\/)\/+/g, "$1"); // ✅ Remove double slashes
    
    try {
      console.log("Fetching from:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn("⚠️ Unauthorized! Logging out...");
          logoutUser();
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Retrieved user results:", data);

      if (data.results) {
        const formattedResults = data.results.map((r) => ({
          ...r,
          emissions: Array.isArray(r.emissions) 
            ? Object.fromEntries(r.emissions.map(({ category, value }) => [category, value])) 
            : {},
          recommendations: Array.isArray(r.recommendations) ? r.recommendations : [],
        }));

        console.log("✅ Processed Results with Emissions:", formattedResults);

        setResults(formattedResults);
        setEmissionsHistory(formattedResults.map((r) => r.total_emissions ?? 0));
        setHasFetchedResults(true);
        localStorage.setItem("userResults", JSON.stringify(formattedResults)); // ✅ Store formatted results
      }
    } catch (error) {
      console.error("🚨 Error fetching user results:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // ✅ Fetch results on mount (fixed async handling)
  useEffect(() => {
    const loadResults = async () => {
      const storedResults = localStorage.getItem("userResults");
      if (storedResults) {
        console.log("✅ Loaded results from localStorage.");
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
        setEmissionsHistory(parsedResults.map((r) => r.total_emissions));
        setHasFetchedResults(true);
      } else {
        await fetchUserResults();
      }
    };

    loadResults();
  }, []); // ✅ Runs only once when the component mounts

  const updateResults = async (newResult = null, source = "manual") => {
    if (!newResult || !newResult.emissions || Object.keys(newResult.emissions).length === 0) {
      console.warn("⚠️ Skipping update: No valid emissions data in newResult.");
      return; // ✅ Prevent storing empty emissions
    }

    const updatedResult = {
      ...newResult,
      source: source || "manual",
      recommendations: generateRecommendations(newResult.emissions),
      create_ts: newResult.create_ts || new Date().toISOString(), // ✅ Ensure timestamp exists
    };

    console.log("📝 Storing updated result with recommendations:", updatedResult);

    setResults((prevResults) => {
      const isDuplicate = prevResults.some((r) => r.create_ts === updatedResult.create_ts);
      if (isDuplicate) {
        console.warn("⚠️ Skipping duplicate entry.");
        return prevResults;
      }

      const updatedResults = [updatedResult, ...prevResults];
      localStorage.setItem("userResults", JSON.stringify(updatedResults)); // ✅ Persist results
      return updatedResults;
    });

    setEmissionsHistory((prev) => [...prev, updatedResult.total_emissions]);
    console.log("✅ Updated results and stored in localStorage:", updatedResult);
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
