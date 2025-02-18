import { createContext, useContext, useState, useEffect } from "react";

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState(null);

  // Fetch Latest Results on App Load
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/latest-results`)
      .then((response) => response.json())
      .then((data) => setResults(data))
      .catch((error) => console.error("Error fetching latest results:", error));
  }, []);

  // Function to Update Results After Upload/Calculation
  const updateResults = (newResults) => {
    setResults(newResults);
  };

  return (
    <ResultsContext.Provider value={{ results, updateResults }}>
      {children}
    </ResultsContext.Provider>
  );
}

// Custom Hook to Use Results
export function useResults() {
  return useContext(ResultsContext);
}
