import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import GaugeChart from "../components/GaugeChart";
import ProgressChart from "../components/ProgressChart";
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

  // ✅ Default U.S. Monthly Average Data
  const usAverage = {
    monthlyRating: USA_AVG_MIDPOINT, 
    ratings: [
      { category: "Electricity", value: 375 },
      { category: "Transportation", value: 458 },
      { category: "Waste", value: 62 },
      { category: "Food", value: 209 },
      { category: "Retail", value: 209 },
    ],
  };

  // ✅ Fetch user results from API
  useEffect(() => {
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

        setUserResults(data); 
        updateResults(data); // ✅ Ensure results are stored in context
        setError(null);
      } catch (err) {
        console.error("🚨 Error fetching user results:", err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate, updateResults]); 

  // ✅ Pie Chart Data (Fix incorrect object reference)
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
          {/* ✅ Display Gauge Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Gauge Comparison</h2>
            <div className="flex justify-center space-x-8">
              <div className="flex flex-col items-center">
                <GaugeChart id="userGauge" rating={userResults?.total_emissions || 0} />
                <p className="mt-2 font-semibold text-gray-900">Your Carbon Footprint</p>
              </div>
            </div>
          </div>

          {/* ✅ Pie Chart for Emissions Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4 h-100">
            <h2 className="font-semibold pb-4">Carbon Emissions Breakdown</h2>
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
