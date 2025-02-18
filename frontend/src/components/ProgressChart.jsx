import { Line } from "react-chartjs-2";

export default function ProgressChart({ data = [] }) { // ✅ Default empty array
  if (!data.length) {
    return <p className="text-gray-500">No progress data available</p>;
  }

  const chartData = {
    labels: data.map((entry) => entry.month),
    datasets: [
      {
        label: "Carbon Footprint Progress",
        data: data.map((entry) => entry.value),
        borderColor: "green",
        borderWidth: 2,
      },
    ],
  };

  return <Line data={chartData} />;
}
