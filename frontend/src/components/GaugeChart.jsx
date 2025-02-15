import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GaugeChart({ rating }) {
  const data = {
    datasets: [
      {
        data: [rating, 100 - rating], // Use API data dynamically
        backgroundColor: ["#34D399", "#D1FAE5"],
        borderWidth: 0,
        cutout: "80%",
        rotation: -90,
        circumference: 180,
      },
    ],
  };

  return (
    <div className="w-40 h-40">
      <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
}
