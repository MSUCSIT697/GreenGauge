import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Add useNavigate
import GaugeChart from "../components/GaugeChart";
import ProgressChart from "../components/ProgressChart";
import UploadModal from "../components/UploadModal";
import { useResults } from "../context/ResultsContext";
import RecommendationSystem from "../components/Recommendations";
import LoginPromptModal from "../components/LoginPromptModal";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

export default function Dashboard() {
  const [progressData, setProgressData] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { results, updateResults } = useResults();
  const navigate = useNavigate(); // ✅ Use navigate for handling unauthorized users
  const { isLoggedIn } = useContext(AuthContext); // Use AuthContext

  const roundToThousandths = (num) => (num ? Number(num.toFixed(3)) : 0);

  const latestReport = results.length > 0 ? results[0] : {
    emissions: {}, 
    total_emissions: 0, 
    recommendations: []
  };


  console.log("✅ Latest Report for Recommendations:", latestReport);
  console.log("✅ Emissions Data Passed:", latestReport?.emissions);
  console.log("✅ Stored Recommendations:", latestReport?.recommendations);

  // ✅ Ensure emissions data is always in { category: value } format
  const emissionsData = latestReport?.emissions
    ? Array.isArray(latestReport.emissions)
        ? Object.fromEntries(latestReport.emissions.map(({ category, value }) => [category, value]))
        : { ...latestReport.emissions }
    : {};

  console.log("✅ Corrected Emissions Data:", emissionsData);

  // ✅ Fetch user results on mount
  // ✅ Move this function OUTSIDE useEffect to prevent re-creation
  const fetchResults = async () => {
    console.log("Fetching user results...");

    if (!isLoggedIn) {
      console.warn("⚠️ User is not logged in, prompting login.");
      setShowLoginModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found. Skipping fetch.");
        return;
      }

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

        // ✅ Only update state if data has changed
      if (JSON.stringify(results) !== JSON.stringify(data.results)) {
        updateResults(data.results || []);
      }
    } catch (error) {
      console.error("🚨 Error fetching user results:", error);
    }
  };

// ✅ Fetch results only ONCE when the component mounts
  useEffect(() => {
    if (results.length === 0 && isLoggedIn) {
        console.log("🔄 Fetching user results...");
        fetchResults();
    }
  }, [results, isLoggedIn]); // ✅ Fetch only when `results` or `isLoggedIn` changes


  // ✅ Update progress tracker when `results` change
  useEffect(() => {
    console.log("✅ Checking if results exist:", results);
    if (results.length === 0) return;

    const userGeneratedResults = results.filter((result) => result.source === "manual" || result.source === "upload");

    console.log("✅ User-generated results:", userGeneratedResults);

    if (userGeneratedResults.length > 0) {
      setProgressData(
        userGeneratedResults.map((result) => ({
          date: result.create_ts ? new Date(result.create_ts).toISOString() : new Date().toISOString(),
          value: result.total_emissions ?? 0,
        }))
      );
    }
  }, [results]);




  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Dashboard :</h1>

      {results.length === 0 && (
        <p className="text-yellow-600 mt-4">
          Using default values. Perform your first calculation or upload a PDF to get personalized data.
        </p>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 w-full min-h-[250px]">
        {/* ✅ Gauge Section */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg flex flex-col items-center h-full min-h-[250px]">
          <GaugeChart
            id="dashboardGauge"
            rating={roundToThousandths(
              latestReport
                ? latestReport.total_emissions > 1333
                  ? 80
                  : latestReport.total_emissions < 1125
                    ? 25
                    : 50
                : 50
            )}
          />
          <p className="mt-2 font-semibold text-gray-900">Your Monthly Footprint Rating</p>
        </div>

        {/* ✅ Category Breakdown */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg text-center h-full min-h-[250px] flex flex-col">
          <h2 className="font-semibold pb-2 text-gray-900">Ratings by Category</h2>
          <ul className="mt-1 text-gray-700 space-y-1 px-8 flex flex-col justify-between">
            {Object.entries(emissionsData).length > 0 ? (
              Object.entries(emissionsData).map(([category, value], index) => (
                <li key={index} className="flex justify-between items-center px-4">
                  <span className="text-gray-700 flex-1 text-left">{category}</span>
                  <span className="text-gray-500 w-16 text-right">{value}</span>
                </li>
              ))
            ) : (

              ["Transportation", "Electricity", "Food", "Retail", "Waste"].map((category, index) => (
                <li key={index} className="flex justify-between items-center px-4">
                  <span className="text-gray-700 flex-1 text-left">{category}</span>
                  <span className="text-gray-500 w-16 text-right">0</span>
                </li>
              ))
            )}
          </ul>


        </div>

        {/* ✅ Recommendations Section */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg text-center h-full min-h-[250px] flex flex-col">
          <h2 className="font-semibold pb-2 text-gray-900">Personalized Recommendations</h2>
          {console.log("✅ Latest Report for Recommendations:", latestReport)}
          {console.log("✅ Emissions Data Passed:", latestReport?.emissions)}
          {console.log("✅ Stored Recommendations:", latestReport?.recommendations)}
          <RecommendationSystem 
            emissions={emissionsData} 
            storedRecommendations={Array.isArray(latestReport.recommendations) ? latestReport.recommendations : []} 
          />
        </div>
      </div>

      {/* ✅ Progress Tracker */}
      <div className="bg-white rounded-lg shadow-md p-6 pb-16 mt-4">
        <h2 className="font-semibold text-gray-900">Progress Tracker:</h2>
        <ProgressChart data={progressData} maxScale={2000} />
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
          Upload New PDF
        </button>
        <Link to="/calculator" className="btn btn-primary">
          Manual Calculator
        </Link>
        <Link to="/reports" className="btn btn-primary">
          View Reports
        </Link>
        <Link to="/results" className="btn btn-primary">
          View Results
        </Link>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      {/* Render LoginPromptModal only if showLoginModal is true */}
      {showLoginModal && (
        <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
