import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import GaugeChart from "../components/GaugeChart";
import ProgressChart from "../components/ProgressChart";
import { useParams } from "react-router-dom";

export default function Results() {
  const [userResults, setUserResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

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
    const endpoint = `${import.meta.env.VITE_API_URL}/api/get_total_emissions/${id}`; // Fixed syntax

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("API response error");
        return res.json();
      })
      .then((data) => {
        if (!data || !data.total_emissions) throw new Error("No data found.");
        console.log("API data:", data);
        // Transform API data
        const transformedData = {
          monthlyRating: data.total_emissions,
          ratings: [
            { category: "Electricity", value: data.emissions_by_category.electricity },
            { category: "Transportation", value: data.emissions_by_category.transportation },
            { category: "Waste", value: data.emissions_by_category.waste },
            { category: "Food", value: data.emissions_by_category.food },
            { category: "Retail", value: data.emissions_by_category.retail },
          ],
        };
        console.log("Transformed data:", transformedData);
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
        data: userResults
          ? userResults.ratings.map((item) => item.value) // Using transformed data
          : [0, 0, 0, 0, 0], // Default to 0
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
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Gauge Comparison</h2>
            <div className="flex justify-center space-x-8">
              <GaugeChart rating={userResults?.monthlyRating || 0} />
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

          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
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
                {userResults?.ratings.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{userResults.ratings[index].category}</td>
                    <td className="px-4 py-2 text-right">{userResults.ratings[index].value}</td>
                    <td className="px-4 py-2 text-right">{njAverage.ratings[index].value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
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

          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Carbon Emissions</h2>
            <Pie data={pieData} height={100} />
            <p className="text-gray-600 text-sm">
              Your total monthly carbon emissions are{" "}
              <span className="text-green-500">{userResults?.monthlyRating || 0}</span> kg CO₂.
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
