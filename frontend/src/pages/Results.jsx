import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import GaugeChart from "../components/GaugeChart";
import RecommendationSystem from "../components/Recommendations";
import { useResults } from "../context/ResultsContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Results() {
  const [userResults, setUserResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { results, updateResults } = useResults();
  const navigate = useNavigate();

  // ✅ Hardcoded U.S. Average Midpoint for Gauge
  const USA_AVG_MIDPOINT = 1225; 
  const USA_AVG_CATEGORY = {
    "Transportation": 458,
    "Electricity": 375,
    "Waste": 62,
    "Food": 209,
    "Retail": 209
  };

  // ✅ Fixed useEffect (Prevents Infinite Loop)
  useEffect(() => {
    if (results.length > 0) {
      console.log("✅ Using cached results from context.");
      setUserResults(results[0]); // ✅ Display latest result
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const fetchResults = async () => {
      try {
        console.log("Fetching user results...");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/get_user_results`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Received results from API:", data);

        if (data.error) {
          setError(data.error);
          return;
        }

        setUserResults(data.results[0] || null); // ✅ Store latest result
        if (results.length === 0) { // ✅ Prevent multiple updates
          updateResults(data.results[0]); 
        }
        setError(null);
      } catch (err) {
        console.error("🚨 Error fetching user results:", err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]); // ✅ Remove `updateResults` from dependencies

  // ✅ Pie Chart Data
  const pieData = {
    labels: ["Food", "Retail", "Transportation", "Electricity", "Waste"],
    datasets: [
      {
        data: userResults?.emissions_by_category
          ? Object.values(userResults.emissions_by_category)
          : [0, 0, 0, 0, 0], 
        backgroundColor: ["#10b981", "#108981", "#fecaca", "#316bd6", "#f09e41"],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">Results Overview:</h1>

      {/* ✅ Error Handling */}
      {error && <p className="text-red-600 text-center mt-5">{error}</p>}

      {/* ✅ Show Loading While Fetching */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : userResults ? (
        <>
          {/* ✅ Gauge Comparison (User vs. US Avg) */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Gauge Comparison</h2>
            <div className="flex justify-center space-x-8">
              <div className="flex flex-col items-center">
                <GaugeChart id="userGauge" rating={userResults?.total_emissions || 0} />
                <p className="mt-2 font-semibold text-gray-900">Your Carbon Footprint</p>
              </div>
              <div className="flex flex-col items-center">
                <GaugeChart id="usGauge" rating={USA_AVG_MIDPOINT} />
                <p className="mt-2 font-semibold text-gray-900">US Average Footprint</p>
              </div>
            </div>
          </div>
          {/* ✅ Comparison of User vs. US Average by Category */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold pb-2">Category Comparison: You vs. US Average</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {Object.entries(userResults?.emissions_by_category || {}).map(([category, value], index) => (
                <li key={index} className="mb-2">
                  <strong>{category}: </strong> 
                  <span className="text-green-600">{value} kg CO₂ (You) </span> |  
                  <span className="text-gray-500"> {USA_AVG_CATEGORY[category]} kg CO₂ (US Avg)</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ Personalized Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Personalized Recommendations</h2>
            <RecommendationSystem emissions={userResults?.emissions_by_category || {}} />
          </div>

          {/* ✅ Pie Chart for Emissions Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4 h-100">
            <h2 className="font-semibold pb-4">Emissions Breakdown</h2>
            <Pie data={pieData} height={50} />
            <p className="text-gray-600 text-sm">
              Your total monthly carbon emissions:{" "}
              <span className="text-green-500">{userResults?.total_emissions || 0}</span> kg CO₂.
            </p>
          </div>

          {/* ✅ Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <Link to="/reports" className="btn btn-primary">View Reports</Link>
            <Link to="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
          </div>
        </>
      ) : (
        <p className="text-red-600 text-center mt-5">No valid results found. Please try again.</p>
      )}
    </div>
  );
}
