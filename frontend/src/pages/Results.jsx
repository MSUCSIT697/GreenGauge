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
      { category: "Electricity", value: -5 },
      { category: "Transportation", value: 15 },
      { category: "Waste", value: -10 },
      { category: "Food", value: 12 },
      { category: "Retail", value: 8 },
    ],
  };

  useEffect(() => {
    const endpoint = id
      ? `${import.meta.env.VITE_API_URL}/api/get_total_emissions/1}` //change back 1 to ${id}
      : `${import.meta.env.VITE_API_URL}/api/get_total_emissions/1`; //change this back to latest-results or something

    fetch(endpoint)
      .then((res) => {
        console.log("Raw API Data:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Raw API Data:", data); // Log raw data

        // Transform data
        const transformedData = {
          monthlyRating: data.total_emissions,
          ratings: [
            { category: "Electricity", value: data.emissions_by_category.electricity_emissions },
            { category: "Transportation", value: data.emissions_by_category.transportation_emissions },
            { category: "Waste", value: data.emissions_by_category.waste_emissions },
            { category: "Food", value: data.emissions_by_category.food_emissions },
            { category: "Retail", value: data.emissions_by_category.retail_emissions },
          ],
        };

        console.log("Transformed Data:", transformedData); // Log transformed data

        return transformedData; // Pass transformed data to the next `.then()`
      })
      .then((transformedData) => {
        console.log("Final Data Before State Update:", transformedData);
        if (!transformedData || !transformedData.monthlyRating) throw new Error("No data found.");
        setUserResults(transformedData);
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
