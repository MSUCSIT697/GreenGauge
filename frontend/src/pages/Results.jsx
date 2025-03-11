import { useState, useEffect } from "react";
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
  const { results } = useResults();
  const roundToThousandths = (num) => {
    return num ? Number(num.toFixed(3)) : 0; // Ensures it always returns a number
  };
  
  
  // ✅ Hardcoded U.S. Average Midpoint for Gauge
  const USA_AVG_MIDPOINT = 1225; // Midpoint based on your provided scale

  // ✅ Default U.S. Monthly Average Data
  const usAverage = {
    monthlyRating: USA_AVG_MIDPOINT, // Always midpoint
    ratings: [
      { category: "Electricity", value: 375 },
      { category: "Transportation", value: 458 },
      { category: "Waste", value: 62 },
      { category: "Food", value: 209 },
      { category: "Retail", value: 209 },
    ],
  };

  useEffect(() => {
    if (results.length > 0) {
      const latestResult = results[0]?.results;
      if (latestResult) {
        console.log("✅ Stored data from results context:", latestResult);
        setUserResults(latestResult);
        setError(null); // ✅ Reset errors if data exists
      } else {
        console.warn("⚠️ No valid results found in context.");
        setError("No valid results found. Please perform a calculation.");
      }
    } else {
      console.warn("⚠️ No stored results available.");
      setError("No results available. Please perform a calculation.");
    }
    setLoading(false);
  }, [results]);

  const pieData = {
    labels: ["Food", "Retail", "Transportation", "Electricity", "Waste"],
    datasets: [
      {
        data: userResults?.ratings
          ? userResults.ratings.map((item) => item.value)
          : [0, 0, 0, 0, 0], // ✅ Default if missing
        backgroundColor: ["#10b981", "#108981", "#fecaca", "#316bd6", "#f09e41"],
      },
    ],
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">Results Overview:</h1>

      {/* ✅ Error Handling for Missing Data */}
      {error && <p className="text-red-600 text-center mt-5">{error}</p>}

      {/* ✅ Show Loading Screen While Fetching Data */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : userResults ? (
        <>
          {/* ✅ Gauge Comparison Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Gauge Comparison</h2>
            <div className="flex justify-center space-x-8">
              {/* ✅ First Gauge - User Results */}
              <div className="flex flex-col items-center">
                <GaugeChart id="userGauge" rating={roundToThousandths(userResults?.monthlyRating || USA_AVG_MIDPOINT)} />
                <p className="mt-2 font-semibold text-gray-900">Your Carbon Footprint Results</p>
              </div>

              {/* ✅ Second Gauge - U.S. Average Gauge (Midpoint Hardcoded) */}
              <div className="flex flex-col items-center">
                <GaugeChart id="avgGauge" rating={USA_AVG_MIDPOINT} />
                <p className="mt-2 font-semibold text-gray-900">USA Average</p>
              </div>
            </div>
          </div>

          {/* ✅ Comparison by Category */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold pb-5">Comparison by Category</h2>
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2 text-right">Your Monthly Carbon Emissions</th>
                  <th className="px-4 py-2 text-right">USA Average Monthly Carbon Emissions</th>
                </tr>
              </thead>
              <tbody>
                {userResults?.ratings.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{item.category}</td>
                    <td className="px-4 py-2 text-right">{item.value}</td>
                    <td className="px-4 py-2 text-right">{usAverage.ratings[index].value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Monthly Sustainability Goals */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold pb-4">Monthly Sustainability Goals</h2>
            <ul>
              <li>
                <span className="text-green-500">&#8226;</span> Try Carpooling or switching to a more fuel-efficient route
              </li>
              <li>
                <span className="text-green-500">&#8226;</span> Try Reducing meat intake and opting for local produce
              </li>
              <li>
                <span className="text-green-500">&#8226;</span> Try to reduce non-essential purchases or choose eco-friendly brands
              </li>
            </ul>
          </div>

          {/* ✅ Carbon Emissions Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4 h-100">
            <h2 className="font-semibold pb-4">Carbon Emissions Breakdown</h2>
            <Pie data={pieData} height={50} />
            <p className="text-gray-600 text-sm">
              Your total monthly carbon emissions are{" "}
              <span className="text-green-500">{userResults?.monthlyRating || 0}</span> kg CO₂.
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
