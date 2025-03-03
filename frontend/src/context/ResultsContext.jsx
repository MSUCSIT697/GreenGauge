import React, { createContext, useContext, useState } from "react";

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [results, setResults] = useState([]);

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
