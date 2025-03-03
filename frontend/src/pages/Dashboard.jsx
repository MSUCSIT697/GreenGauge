import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GaugeChart from "../components/GaugeChart";
import ProgressChart from "../components/ProgressChart";
import UploadModal from "../components/UploadModal"; // ✅ Import modal
import { useResults } from "../context/ResultsContext";

export default function Dashboard() {
  const [progressData, setProgressData] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false); // ✅ State for modal
  const { results } = useResults(); // ✅ Get stored results

  const latestReport = results.length > 0 ? results[0] : null; // ✅ Use latest stored report

  // Default placeholder data if no results exist
  const defaultData = [
    { date: "2024-01-01", value: 100 },
    { date: "2024-01-15", value: 150 },
    { date: "2024-02-01", value: 200 },
    { date: "2024-02-15", value: 250 },
    { date: "2024-03-01", value: 300 },
    { date: "2024-03-15", value: 350 },
  ];

  useEffect(() => {
    // Use stored results if available, otherwise use default data
    setProgressData(
      results.length > 0
        ? results.map(report => ({
            date: report.date,
            value: report.results.total_emissions,
          }))
        : defaultData
    );
  }, [results]);

  console.log("Processed Data Sent to ProgressChart:", progressData);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Dashboard :</h1>

      {/* ✅ Unified Error & Warning Message */}
      {results.length === 0 && (
        <p className="text-yellow-600 mt-4">
          Using default values. Perform your first calculation or upload a PDF to get personalized data.
        </p>
      )}

      {/* ✅ Dashboard Section with Frames */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col lg:flex-row justify-between space-x-4 px-4 items-center">
        {/* Rating Frame */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg flex flex-col items-center">
          {/* Avg individual in US emits 1125-1333 kg CO2e per month. so map accordingly */}
          <GaugeChart rating={latestReport ? (latestReport.results.total_emissions > 1333 ? 80 : (latestReport.results.total_emissions < 1125 ? 25 : 50)) : 50} />
          <p className="mt-2 font-semibold text-gray-900">Your Monthly Footprint Rating</p> 
        </div>

        {/* Ratings by Category Frame */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg text-center">
          <h2 className="font-semibold text-gray-900">Ratings by Category</h2>
          <ul className="mt-1 text-gray-700 space-y-1 px-8">
            {latestReport
              ? latestReport.results.ratings.map((item, index) => (
                  <li key={index} className="flex justify-between items-center px-4">
                    <span className="text-gray-700 flex-1 text-left">{item.category}</span>
                    <span className="text-gray-500 w-16 text-right">{item.value}</span>
                  </li>
                ))
              : ["Transportation", "Electricity", "Food", "Retail", "Waste"].map((category, index) => (
                  <li key={index} className="flex justify-between items-center px-4">
                    <span className="text-gray-700 flex-1 text-left">{category}</span>
                    <span className="text-gray-500 w-16 text-right">0</span>
                  </li>
                ))}
          </ul>
        </div>

        {/* Sustainability Goals Frame */}
        <div className="flex-1 bg-gray-50 p-4 rounded-lg text-center">
          <h2 className="font-semibold text-gray-900">Monthly Sustainability Goals</h2>
          <ul className="mt-1 space-y-2 px-8 text-left">
            {latestReport
              ? latestReport.results.sustainabilityGoals.map((goal, index) => (
                  <li key={index} className="flex items-center px-4">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-left">{goal.text}</span>
                  </li>
                ))
              : ["Try Carpooling", "Reduce Meat Intake", "Use Eco-friendly Brands"].map((goal, index) => (
                  <li key={index} className="flex items-center px-4">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-left">{goal}</span>
                  </li>
                ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 pb-16 mt-4">
        <h2 className="font-semibold text-gray-900">Progress Tracker:</h2>
        <ProgressChart data={progressData} maxScale={1000} />
      </div>

      {/* ✅ Action Buttons */}
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

      {/* ✅ Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
