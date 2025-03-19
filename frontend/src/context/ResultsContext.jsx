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
      if (!data || !data.results) throw new Error("Invalid API response format");

      console.log("✅ Retrieved user results:", data);

      const formattedResults = data.results.map((r) => ({
        ...r,
        emissions: Array.isArray(r.emissions) 
          ? Object.fromEntries(r.emissions.map(({ category, value }) => [category, value])) 
          : {},
        recommendations: Array.isArray(r.recommendations) ? r.recommendations : [],
      }));

      setResults(formattedResults);
      setEmissionsHistory(formattedResults.map((r) => r.total_emissions ?? 0));
      setHasFetchedResults(true);
      localStorage.setItem("userResults", JSON.stringify(formattedResults));
      
    } catch (error) {
      console.error("🚨 Error fetching user results:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedResults && !isFetching && results.length === 0) {
      fetchUserResults();
    }
  }, [hasFetchedResults, isFetching, results]);

  const updateResults = async (newResult = null, source = "manual") => {
    if (!newResult || !newResult.emissions || Object.keys(newResult.emissions).length === 0) {
      console.warn("⚠️ Skipping update: No valid emissions data in newResult.");
      return;
    }

    const formattedEmissions = newResult?.emissions
      ? Array.isArray(newResult.emissions)
          ? Object.fromEntries(newResult.emissions.map(({ category, value }) => [category, value]))
          : { ...newResult.emissions }
      : {};

    const updatedResult = {
      ...newResult,
      source: source || "manual",
      recommendations: Array.isArray(newResult.recommendations) 
        ? newResult.recommendations 
        : generateRecommendations(formattedEmissions),
      create_ts: newResult.create_ts || new Date().toISOString(),
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
