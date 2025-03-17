import { useState } from "react";
import { Line } from "react-chartjs-2";
import {Chart as ChartJS, LineElement, LinearScale, TimeScale, CategoryScale, PointElement, Title, Tooltip,} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register( LineElement, LinearScale, TimeScale, CategoryScale, PointElement, Title, Tooltip);

export default function ProgressChart({ data = [], maxScale = 2450 }) {
  
  const [timeFrame, setTimeFrame] = useState("3M");

  const defaultData = [
    { date: "2024-10-01", value: 100 },
    { date: "2024-11-15", value: 150 },
    { date: "2025-01-01", value: 200 },
    { date: "2025-01-15", value: 250 },
    { date: "2025-02-01", value: 300 },
    { date: "2025-02-15", value: 350 },
  ];

  // ✅ Only use defaultData if the user has not made a manual calculation or upload
  const hasUserData = data.some(entry => entry.source === "manual" || entry.source === "upload");
  let allData = hasUserData ? [...data] : defaultData;


  // ✅ Sort data chronologically
  allData = allData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Set cutoff date based on selected timeframe
  const now = new Date();
  const cutoffDate = new Date();
  cutoffDate.setHours(0, 0, 0, 0);

  if (timeFrame === "1M") {
    cutoffDate.setMonth(now.getMonth() - 1);
  } else if (timeFrame === "3M") {
    cutoffDate.setMonth(now.getMonth() - 3);
  } else if (timeFrame === "6M") {
    cutoffDate.setMonth(now.getMonth() - 6);
  } else if (timeFrame === "1Y") {
    cutoffDate.setFullYear(now.getFullYear() - 1);
    cutoffDate.setMonth(now.getMonth());
    cutoffDate.setDate(1);
  }

  // ✅ Filter data based on selected timeframe, but keep last known point
  let filteredData = allData.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate && entryDate <= now;
  });

  // ✅ Ensure `1M` has at least 2 points to maintain trend visualization
  if (timeFrame === "1M" && filteredData.length === 1 && allData.length > 1) {
    filteredData = allData.slice(-2);
  }

  // ✅ Ensure longer timeframes show the last known point for continuity
  if (filteredData.length === 0) {
    filteredData = [allData[allData.length - 1]];
  }

  const chartData = {
    labels: filteredData.map((entry) =>
      new Date(entry.date).toLocaleDateString("en-US", {
        month: timeFrame === "1Y" ? "short" : "short",
        year: timeFrame === "1Y" ? "numeric" : undefined,
        day: timeFrame === "1M" ? "numeric" : undefined,
      })
    ),
    datasets: [
      {
        label: "Total Emissions Over Time",
        data: filteredData.map((entry) => ({
          x: new Date(entry.date),
          y: entry.value,
        })),
        borderColor: "green",
        borderWidth: 2,
        fill: false,
        tension: 0.3, // ✅ Smoother line transitions
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "green",
        pointBorderColor: "white",
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="h-80">
      <div className="flex justify-end space-x-2 mb-2">
        {["1M", "3M", "6M", "1Y"].map((frame) => (
          <button
            key={frame}
            className={`px-3 py-1 rounded-md ${
              timeFrame === frame ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTimeFrame(frame)}
          >
            {frame}
          </button>
        ))}
      </div>

      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit:
                  timeFrame === "1M"
                    ? "day"
                    : timeFrame === "3M"
                    ? "week"
                    : timeFrame === "1Y"
                    ? "month"
                    : "month",
                tooltipFormat: timeFrame === "1Y" ? "MMM yyyy" : "MMM dd",
              },
              min: cutoffDate,
              max: now,
              title: {
                display: true,
                text: "Date",
              },
            },
            y: { min: 0, max: maxScale },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const { x, y } = context.raw;
                  const date = new Date(x).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  return `${date}: ${y} kg CO2e`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
