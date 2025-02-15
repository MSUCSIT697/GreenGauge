import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

// ✅ Register CategoryScale to fix "category is not a registered scale"
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

export default function ProgressChart() {
  const [progressData, setProgressData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/progress-data")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Progress API Response:", data);
        setProgressData(data);
      })
      .catch((error) => {
        console.error("Error fetching progress data:", error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <p className="text-red-500">Error loading progress data: {error}</p>;
  }

  // ✅ Ensure `progressData` is not empty before rendering chart
  if (progressData.length === 0) {
    return <p>Loading Progress Data...</p>;
  }

  const chartData = {
    labels: progressData.map((entry) => entry.month),
    datasets: [
      {
        label: "Carbon Footprint",
        data: progressData.map((entry) => entry.value),
        borderColor: "#34D399",
        backgroundColor: "#D1FAE5",
      },
    ],
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
}
