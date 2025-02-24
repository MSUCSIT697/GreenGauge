import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import GaugeChart from "../components/GaugeChart";
import ProgressChart from "../components/ProgressChart";

export default function Results() {
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
      .catch((error) => {
        console.error("Error fetching results:", error);
        setError("Failed to load results.");
        setLoading(false);
      });
  }, []);

  const pieData = {
    labels: ["Food", "Retail", "Transportation", "Electricity", "Waste"],
    datasets: [
      {
        data: [
          userResults?.food_emissions || 0,
          userResults?.retail_emissions || 0,
          userResults?.transportation_emissions || 0,
          userResults?.electricity_emissions || 0,
          userResults?.waste_emissions || 0,
        ],
        backgroundColor: ["#10b981", "#108981", "#fecaca", "#316bd6", "#f09e41"],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">Results Overview:</h1>

      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mt-4 h-400">
            <h2 className="font-semibold">Gauge Comparison</h2>
            <div className="flex justify-center space-x-8">
              <GaugeChart rating={userResults?.total_emissions || 0} />
              <GaugeChart rating={120} />
            </div>
            <p className="text-gray-600">
              This result was generated from a{" "}
              {userResults?.calculation_method === "manual" ? (
                <span className="text-green-500">manual calculation</span>
              ) : (
                <span className="text-blue-500">PDF scan</span>
              )}
              .
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-4 h-400">
            <h2 className="font-semibold">Comparison by Category</h2>
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2 text-right">Your Monthly Carbon Emissions</th>
                  <th className="px-4 py-2 text-right">Average NJ Resident Monthly Carbon Emissions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">Food</td>
                  <td className="px-4 py-2 text-right">{userResults?.food_emissions || 0}</td>
                  <td className="px-4 py-2 text-right">160</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Retail</td>
                  <td className="px-4 py-2 text-right">{userResults?.retail_emissions || 0}</td>
                  <td className="px-4 py-2 text-right">90</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Transportation</td>
                  <td className="px-4 py-2 text-right">{userResults?.transportation_emissions || 0}</td>
                  <td className="px-4 py-2 text-right">180</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Electricity</td>
                  <td className="px-4 py-2 text-right">{userResults?.electricity_emissions || 0}</td>
                  <td className="px-4 py-2 text-right">120</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Waste</td>
                  <td className="px-4 py-2 text-right">{userResults?.waste_emissions || 0}</td>
                  <td className="px-4 py-2 text-right">40</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-4 h-400">
            <h2 className="font-semibold">Monthly Sustainability Goals</h2>
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

          <div className="bg-white rounded-lg shadow-md p-6 mt-4 h-200">
            <h2 className="font-semibold">Carbon Emissions</h2>
            <Pie data={pieData} height={100} />
            <p className="text-gray-600 text-sm">
              Your total monthly carbon emissions are{" "}
              <span className="text-green-500">{userResults?.total_emissions || 0}</span> kg CO₂.
            </p>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <Link to="/reports" className="btn btn-primary">View Reports</Link>
            <Link to="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
          </div>
        </>
      )}
    </div>
  );
}
