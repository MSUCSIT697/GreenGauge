import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GaugeChart from "../components/GaugeChart";
import ProgressChart from "../components/ProgressChart";
import UploadModal from "../components/UploadModal"; // ✅ Import modal

export default function Dashboard() {
  const [monthlyRating, setMonthlyRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [sustainabilityGoals, setSustainabilityGoals] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false); // ✅ State for modal

  useEffect(() => {
    console.log("Fetching dashboard data...");

    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard-data`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Dashboard data received:", data);
        setMonthlyRating(data?.monthlyRating ?? 0);
        setRatings(data?.ratings ?? []);
        setSustainabilityGoals(data?.sustainabilityGoals ?? []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load data, using default values.");
        setLoading(false);
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/progress-data`)
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
      })
      .catch(() => {
        console.error("Failed to fetch progress data");
        setProgressData([]);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Dashboard :</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col lg:flex-row justify-between">
        <div className="flex-1 flex flex-col items-center">
          <GaugeChart rating={monthlyRating} />
          <p className="mt-2 font-semibold text-gray-900">Your Monthly Footprint Rating</p>
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">Ratings by Category</h2>
          <ul className="mt-2 text-gray-700">
            {ratings.map((item, index) => (
              <li key={index}>
                {item.category}: <span className="text-gray-500">{item.value}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">Monthly Sustainability Goals</h2>
          <ul className="mt-2 space-y-2">
            {sustainabilityGoals.map((goal, index) => (
              <li key={index} className="flex items-center">
                <input type="checkbox" checked={goal.completed} className="mr-2" readOnly />
                {goal.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        <h2 className="font-semibold text-gray-900">Progress Tracker:</h2>
        <ProgressChart data={progressData} />
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
      </div>

      {/* ✅ Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
