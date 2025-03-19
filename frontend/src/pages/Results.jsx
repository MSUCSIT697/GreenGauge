import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Added `useParams`
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import GaugeChart from "../components/GaugeChart";
import RecommendationSystem from "../components/Recommendations";
import { useResults } from "../context/ResultsContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Results() {
  const { results, updateResults } = useResults();
  const { reportId } = useParams(); // ✅ Get the report ID from the URL
  const navigate = useNavigate();

  const [userResults, setUserResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Hardcoded U.S. Average Midpoint for Gauge
  const USA_AVG_MIDPOINT = 1225; 
  const USA_AVG_CATEGORY = {
    "Transportation": 458,
    "Electricity": 375,
    "Waste": 62,
    "Food": 209,
    "Retail": 209
  };

  // ✅ NEW: Find the specific report the user clicked on
  useEffect(() => {
    if (!reportId) {
      setError("Invalid report ID.");
      setLoading(false);
      return;
    }

    console.log(`🔍 Looking for report with ID: ${reportId}`);

    // ✅ Find the report matching the `reportId`
    const matchingReport = results.find(report => report.create_ts === reportId);

    if (matchingReport) {
      console.log("✅ Found matching report:", matchingReport);
      setUserResults(matchingReport);
    } else {
      setError("No report found for this ID.");
    }

    setLoading(false);
  }, [reportId, results]);

  // ✅ Check local storage for past results if needed
  useEffect(() => {
    if (userResults) return; // ✅ Skip if already found in context

    console.log("🔍 Checking local storage for past results.");
    const storedResults = localStorage.getItem("userResults");

    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      const matchingStoredReport = parsedResults.find(report => report.create_ts === reportId);
      
      if (matchingStoredReport) {
        console.log("✅ Loaded results from local storage:", matchingStoredReport);
        setUserResults(matchingStoredReport);
        setLoading(false);
        return;
      }
    }

    // If no stored results, fetch from API
    useEffect(() => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.warn("⚠️ No authentication token found.");
        setError("Session expired. Please log in.");
        navigate("/sign-in");
        return;
      }
    
      const fetchResults = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/get_user_results`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
    
          if (!response.ok) {
            if (response.status === 401) {
              console.warn("⚠️ Unauthorized! Redirecting to login...");
              navigate("/sign-in");
            }
            throw new Error(`API request failed with status ${response.status}`);
          }
    
          const data = await response.json();
          console.log("✅ Retrieved user results:", data);
          if (data.results) setUserResults(data.results.find(r => r.create_ts === reportId) || null);
        } catch (err) {
          console.error("🚨 Error fetching user results:", err);
          setError("Failed to fetch results.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchResults();
    }, [navigate, reportId]);
    

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

        const matchingApiReport = data.results.find(report => report.create_ts === reportId);

        if (matchingApiReport) {
          setUserResults(matchingApiReport);
          updateResults(matchingApiReport);
        } else {
          setError("No matching report found.");
        }

      } catch (err) {
        console.error("🚨 Error fetching user results:", err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userResults, reportId, results, navigate, updateResults]);

  // ✅ Properly Format Emissions Data
  const formattedEmissions = userResults?.emissions
    ? Array.isArray(userResults.emissions)
      ? Object.fromEntries(userResults.emissions.map(({ category, value }) => [category, value]))
      : { ...userResults.emissions }
    : {};

  console.log("✅ Processed Emissions for Recommendations:", formattedEmissions);

  // ✅ Pie Chart Data
  const pieData = {
    labels: ["Food", "Retail", "Transportation", "Electricity", "Waste"],
    datasets: [
      {
        data: Object.values(formattedEmissions), 
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

          {/* ✅ Personalized Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Personalized Recommendations</h2>
            <RecommendationSystem 
                emissions={formattedEmissions} 
                storedRecommendations={Array.isArray(userResults?.recommendations) ? userResults.recommendations : []} 
            />
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
