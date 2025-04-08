import { useEffect, useRef } from "react";
import JustGage from "justgage";
import "raphael"; // Required for JustGage

export default function SimpleGauge({ value = 50, id = "homeGauge", activated = false }) {
  const gaugeRef = useRef(null);
  const lastValue = useRef(value);

  useEffect(() => {
    const g = new JustGage({
      id,
      value,
      min: 0,
      max: 100,
      title: "",
      levelColors: ["#10b981", "#f09e41", "#ef4444"],
      gaugeWidthScale: 0.5,
      pointer: true,
      hideMinMax: true,
      textRenderer: () => "",
      refreshAnimationType: "linear",
      refreshAnimationTime: 1000,
    });
    gaugeRef.current = g;
  }, [id]);

  useEffect(() => {
    if (gaugeRef.current && activated && lastValue.current !== value) {
      gaugeRef.current.refresh(value);
      lastValue.current = value;
    }
  }, [value, activated]);

  return (
    <div className="flex flex-col items-center">
      <div id={id} className="w-64 h-[8.75rem] -mb-3" /> {/* Reduced height + stronger margin pull */}
      <div className="flex justify-between w-64 px-1 text-xs text-gray-600 -mt-2">
        <div className="flex flex-col items-center text-center leading-none">
          <span>Low</span>
          <span>Emissions</span>
        </div>
        <div className="flex flex-col items-center text-center leading-none">
          <span>High</span>
          <span>Emissions</span>
        </div>
      </div>
    </div>
  );
}
