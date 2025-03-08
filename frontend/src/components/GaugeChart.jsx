import { useEffect, useState } from "react";
import JustGage from "justgage";
import "raphael"; // Required for JustGage

const DEFAULT_US_AVG = 1225; // Hardcoded US Average
const DEFAULT_MAX = 2450; // Max is 2× US Avg

export default function GaugeChart({ rating }) {
  const displayValue = rating !== undefined ? rating : DEFAULT_US_AVG;
  const [gauge, setGauge] = useState(null);

  useEffect(() => {
    console.log("Gauge initialized with:", displayValue);

    const newGauge = new JustGage({
      id: "gaugeChart",
      value: displayValue,
      min: 0,
      max: DEFAULT_MAX,
      title: "",
      levelColorsGradient: true,
      levelColors: [
        "#3B82F6", // Blue (Below Average)
        "#10B981", // Green (Ideal Range)
        "#EF4444", // Red (Above Average)
      ],
      gaugeWidthScale: 0.7, // 🔹 Slightly larger gauge
      pointer: true,
      hideMinMax: false,
      customSectors: [
        {
          color: "#3B82F6", // Blue for values below US Avg
          lo: 0,
          hi: DEFAULT_US_AVG - 50,
        },
        {
          color: "#10B981", // Green for values near US Avg
          lo: DEFAULT_US_AVG - 50,
          hi: DEFAULT_US_AVG + 50,
        },
        {
          color: "#EF4444", // Red for above US Avg
          lo: DEFAULT_US_AVG + 50,
          hi: DEFAULT_MAX,
        },
      ],
    });

    setGauge(newGauge);

    // ✅ Ensure gauge updates dynamically when rating changes
    if (newGauge) {
      setTimeout(() => {
        console.log("Refreshing gauge with:", displayValue);
        newGauge.refresh(displayValue);
      }, 200);
    }
  }, [rating]);

  return (
    <div className="flex flex-col items-center">
      <div id="gaugeChart" className="w-72 h-40"></div> {/* 🔹 Slightly bigger gauge */}
    </div>
  );
}
