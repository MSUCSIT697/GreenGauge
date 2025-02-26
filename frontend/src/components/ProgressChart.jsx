//chart for 1 year still has to be fixed

import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, LinearScale, TimeScale, CategoryScale, PointElement, Title } from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, LinearScale, TimeScale, CategoryScale, PointElement, Title);


export default function ProgressChart({ data, maxScale = 1000 }) {
  console.log("ProgressChart received data:", data); // ✅ Move inside function

  const [timeFrame, setTimeFrame] = useState("3M"); // Default to 1 year


  // Default placeholder data if no progress is recorded yet
  const defaultData = [
    { date: "2024-10-01", value: 100 },
    { date: "2024-11-15", value: 150 },
    { date: "2025-01-01", value: 200 },
    { date: "2025-01-15", value: 250 },
    { date: "2025-02-01", value: 300 },
    { date: "2025-02-15", value: 350 },
  ];

  // Use real data if available, otherwise use placeholder
  const progressData = data.length > 0 
  ? data.map(entry => ({ date: entry.date, value: entry.value }))
  : defaultData;


  // Format dates for better display
  const formattedData = progressData.map((entry) => ({
    ...entry,
    formattedDate: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  // Filter data based on selected time frame
  const now = new Date();
  const cutoffDate = new Date();
  cutoffDate.setHours(0, 0, 0, 0);
  
  // Adjust cutoff date based on selected time frame
  if (timeFrame === "1M") {
    cutoffDate.setMonth(now.getMonth() - 1);
  } else if (timeFrame === "3M") {
    cutoffDate.setMonth(now.getMonth() - 3);
  } else if (timeFrame === "6M") {
    cutoffDate.setMonth(now.getMonth() - 6);
  } else if (timeFrame === "1Y") {
    cutoffDate.setFullYear(now.getFullYear() - 1);
    cutoffDate.setDate(cutoffDate.getDate() + 1); // ✅ Ensures it includes the full last 12 months
  }
  
  // ✅ Debugging Log
  console.log("Cutoff date for", timeFrame, "view:", cutoffDate);
  
  
  
  
  // Ensure correct data is included
  const filteredData = progressData.filter(entry => {
    const entryDate = new Date(entry.date);
    const includeEntry = entryDate >= cutoffDate && entryDate <= now;
  
    console.log(`Checking entry: ${entry.date} | Date: ${entryDate} | Included: ${includeEntry}`);
    
    return includeEntry; // ✅ Ensures all correct data is included
  });
  
  
  console.log("Filtered Data for", timeFrame, ":", filteredData);
  
  
  const chartData = {
    labels: filteredData.length > 0 
      ? filteredData.map(entry => new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })) 
      : defaultData.map(entry => new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })),
    
    datasets: [
      {
        label: "Total Emissions Over Time",
        data: filteredData.length > 0 
          ? filteredData.map(entry => ({ x: new Date(entry.date), y: entry.value })) 
          : defaultData.map(entry => ({ x: new Date(entry.date), y: entry.value })),
        borderColor: "green",
        borderWidth: 2,
        fill: false,
      },
    ],
  };
  
  console.log("Filtered Data for", timeFrame, ":", filteredData);
  console.log("Chart Labels (X-Axis):", chartData.labels);
  console.log("Chart Dataset Values:", chartData.datasets[0].data);
  

  console.log("Final progressData sent to chart:", progressData);

  return (
    <div className="h-80"> {/* Reduced height */}
      {/* Time Frame Selector */}
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

      {/* Chart */}
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: timeFrame === "1M" ? "day" : timeFrame === "3M" ? "week" : "month",
                tooltipFormat: "MMM dd",
              },
              min: cutoffDate, // ✅ This needs modification
              max: new Date(),
              title: {
                display: true,
                text: "Date",
              },
            },
            y: { min: 0, max: maxScale },
          },
        }}
      />



    </div>
  );
}
