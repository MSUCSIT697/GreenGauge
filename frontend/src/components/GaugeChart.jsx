import { useState, useEffect } from "react";
import JustGage from "justgage";
import "raphael"; // Required for JustGage

const DEFAULT_US_AVG = 1225; // Hardcoded U.S. Average
const DEFAULT_MAX = 2450; // Max scale

export default function GaugeChart({ rating, id = "defaultGauge" }) { // ✅ Default ID
  const displayValue = rating !== undefined ? rating : DEFAULT_US_AVG;
  const [gauge, setGauge] = useState(null);

  useEffect(() => {
    console.log(`Gauge initialized [${id}] with:`, displayValue);

    const newGauge = new JustGage({
      id: id,  // ✅ Uses unique ID passed from parent component
      value: displayValue,
      min: 0,
      max: DEFAULT_MAX,
      title: "",
      levelColorsGradient: true,
      levelColors: [
        "#108981", // Blue (Below Average)
        "#10B981", // Green (Ideal Range)
        "#EF4444", // Red (Above Average)
      ],
      gaugeWidthScale: 0.7,
      pointer: true,
      hideMinMax: false,
      customSectors: [
        {
          color: "#3B82F6", // Blue for below average
          lo: 0,
          hi: DEFAULT_US_AVG - 50,
        },
        {
          color: "#10B981", // Green for near average
          lo: DEFAULT_US_AVG - 50,
          hi: DEFAULT_US_AVG + 50,
        },
        {
          color: "#EF4444", // Red for above average
          lo: DEFAULT_US_AVG + 50,
          hi: DEFAULT_MAX,
        },
      ],
    });

    setGauge(newGauge);

    if (newGauge) {
      setTimeout(() => {
        console.log(`Refreshing gauge [${id}] with:`, displayValue);
        newGauge.refresh(displayValue);
      }, 200);
    }
  }, [rating, id]); // ✅ Ensure it updates when rating changes

  return (
    <div className="flex flex-col items-center">
      <div id={id} className="w-72 h-40"></div> {/* ✅ Unique ID for rendering */}
    </div>
  );
}
