import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import GaugeChart from "../components/GaugeChart";
import ProgressChart from "../components/ProgressChart";

export default function Results() {
  const { id } = useParams(); // ✅ Get report ID if accessing from Reports Page
  const [userResults, setUserResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const njAverage = {
    monthlyRating: 85,
    ratings: [
      { category: "House", value: -5 },
      { category: "Car", value: 15 },
      { category: "Public Transport", value: -10 },
      { category: "Food", value: 12 },
      { category: "Retail", value: 8 },
    ],
  };

  useEffect(() => {
    const endpoint = id
      ? `${import.meta.env.VITE_API_URL}/api/get_total_emissions/${id}`
      : `${import.meta.env.VITE_API_URL}/api/get_total_emissions/1`; //chage this back to latest-results or something

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.monthlyRating) throw new Error("No data found.");
        setUserResults(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setUserResults(null);
        setLoading(false);
      });
  }, [id]);

  const pieData = {
    labels: userResults?.ratings?.map((item) => item.category) || [],
    datasets: [
      {
        data: userResults?.ratings?.map((item) => Math.abs(item.value)) || [],
        backgroundColor: ["#10b981", "#108981", "#fecaca", "#316bd6", "#f09e41"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Results Overview:</h1>

      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mt-4 flex flex-col lg:flex-row justify-between">
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-lg font-semibold">Your Score</h2>
              <GaugeChart rating={userResults?.monthlyRating || 0} />
            </div>

            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-lg font-semibold">NJ Average</h2>
              <GaugeChart rating={njAverage.monthlyRating} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold text-gray-900">Your Carbon Emission Breakdown</h2>
            <Pie data={pieData} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold text-gray-900">Progress Tracker:</h2>
            <ProgressChart />
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <Link to="/reports" className="btn btn-primary">
              View Reports
            </Link>
            <Link to="/dashboard" className="btn btn-primary">
              Return to Dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
