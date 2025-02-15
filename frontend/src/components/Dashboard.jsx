import { useState, useEffect } from "react";
import GaugeChart from "./GaugeChart";
import ProgressChart from "./ProgressChart";

export default function Dashboard() {
  const [monthlyRating, setMonthlyRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [sustainabilityGoals, setSustainabilityGoals] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    fetch("http://127.0.0.1:5000/api/dashboard-data")
      .then((response) => response.json())
      .then((data) => {
        setMonthlyRating(data.monthlyRating);
        setRatings(data.ratings);
        setSustainabilityGoals(data.sustainabilityGoals);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="bg-green-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Dashboard :</h1>

      {/* Dashboard Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col lg:flex-row justify-between">
        
        {/* Gauge Chart Section */}
        <div className="flex-1 flex flex-col items-center">
          {monthlyRating !== null ? (
            <GaugeChart rating={monthlyRating} />
          ) : (
            <p>Loading...</p>
          )}
          <p className="mt-2 font-semibold text-gray-900">Your Monthly Footprint Rating</p>
        </div>

        {/* Ratings by Category */}
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">Ratings by Category</h2>
          {ratings.length > 0 ? (
            <ul className="mt-2 text-gray-700">
              {ratings.map((item, index) => (
                <li key={index}>
                  {item.category}: <span className={item.value < 0 ? "text-green-500" : "text-red-500"}>{item.value}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Sustainability Goals */}
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">Monthly Sustainability Goals</h2>
          {sustainabilityGoals.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {sustainabilityGoals.map((goal, index) => (
                <li key={index} className="flex items-center">
                  <input type="checkbox" checked={goal.completed} className="mr-2" />
                  {goal.text}
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        <h2 className="font-semibold text-gray-900">Progress Tracker:</h2>
        <ProgressChart />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700">
          Upload New PDF
        </button>
        <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700">
          Manual Calculator
        </button>
        <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700">
          View Reports
        </button>
      </div>
    </div>
  );
}
