import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, LinearScale, TimeScale, CategoryScale, PointElement, Title, Tooltip } from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, LinearScale, TimeScale, CategoryScale, PointElement, Title, Tooltip);

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

  // ✅ Retrieve stored emissions & check if user has results
  const storedResults = JSON.parse(localStorage.getItem("userResults") || "[]");
  const hasUserData = storedResults.length > 0 || data.length > 0;
  let allData = hasUserData ? [...storedResults, ...data] : defaultData;

  // ✅ Remove duplicates by ensuring unique dates
  allData = [...new Map(allData.map(item => [item.create_ts, item])).values()];

  // ✅ Sort data chronologically (oldest → newest)
  allData.sort((a, b) => new Date(a.create_ts) - new Date(b.create_ts));

  // ✅ Set cutoff date based on timeframe selection
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

  // ✅ Filter data based on timeframe, but always show last known entry
  let filteredData = allData.filter(entry => {
    const entryDate = new Date(entry.create_ts);
    return entryDate >= cutoffDate && entryDate <= now;
  });

  // ✅ Ensure at least one point is visible
  if (filteredData.length === 0 && allData.length > 0) {
    filteredData = [allData.at(-1)];
  }

  // ✅ Add 5-day buffer at the end of the chart
  const maxDate = new Date(Math.max(...filteredData.map(d => new Date(d.create_ts))));
  const bufferDate = new Date(maxDate);
  bufferDate.setDate(maxDate.getDate() + 5);

  // ✅ Set the max Y-axis value dynamically
  const highestValue = Math.max(...filteredData.map(entry => entry.total_emissions), 1500);
  const adjustedMaxScale = highestValue + 500;

  const chartData = {
    labels: filteredData.map(entry =>
      new Date(entry.create_ts).toLocaleDateString("en-US", {
        month: timeFrame === "1Y" ? "short" : "short",
        year: timeFrame === "1Y" ? "numeric" : undefined,
        day: timeFrame === "1M" ? "numeric" : undefined,
      })
    ),
    datasets: [
      {
        label: "Total Emissions Over Time",
        data: filteredData.map(entry => ({
          x: new Date(entry.create_ts),
          y: entry.total_emissions,
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
        {["1M", "3M", "6M", "1Y"].map(frame => (
          <button
            key={frame}
            className={`px-3 py-1 rounded-md ${
              timeFrame === frame ? "bg-primary text-white" : "bg-gray-200"
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
              max: bufferDate, // ✅ Extends the chart by 5 days
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              min: 0,
              max: adjustedMaxScale, // ✅ Dynamically adjust max scale
              title: {
                display: true,
                text: "kg CO2e",
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: context => {
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
