import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JustGage from "justgage";
import "raphael"; // Required for JustGage

export default function Home() {
  const [gauge, setGauge] = useState(null);
  const [userChoice, setUserChoice] = useState(null); // "yes" or "no"

  useEffect(() => {
    // ✅ Initialize JustGage without labels
    const newGauge = new JustGage({
      id: "gaugeChart",
      value: 50, // Default midpoint
      min: 0,
      max: 100,
      title: "",
      levelColors: ["#10b981", "#f09e41", "#ef4444"], // Green to red
      gaugeWidthScale: 0.5, // ✅ Thinner gauge
      pointer: true,
      hideMinMax: true, // ✅ Hides numeric scale
      textRenderer: function () {
        return ""; // ✅ Ensures numbers are not displayed
      },
    });
    setGauge(newGauge);
  }, []);

  const handleGaugeChange = (choice) => {
    setUserChoice(choice);

    if (gauge) {
      if (choice === "yes") {
        gauge.refresh(10); // ✅ Almost empty (Green - Low Emissions)
      } else {
        gauge.refresh(90); // ✅ Almost full (Red - High Emissions)
      }
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-green-700 mb-6">Green Gauge</h1>

      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl flex flex-col lg:flex-row">
        {/* Mission Statement */}
        <div className="flex-1 p-4">
          <h2 className="text-lg font-semibold">Our Mission Statement</h2>
          <p className="mt-2 text-gray-700">
            Here at Green Gauge, our mission is to help people be more sustainability conscious. 
            After analyzing an initial Carbon Footprint Rating, we provide suggestions to reduce 
            your carbon footprint through monthly goals.
          </p>
          <h2 className="text-lg font-semibold mt-4">How Green Gauge Works</h2>
          <p className="mt-2 text-gray-700">
            Users submit PDFs of their bank statements. Our system reviews, categorizes, and 
            rates spending sustainability. Based on results, personalized sustainability 
            suggestions are provided.
          </p>
        </div>

        {/* Gauge Chart Section */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="relative flex flex-col items-center">
            <div id="gaugeChart" className="w-64 h-64"></div>
          </div>

          {/* ✅ Move the question & buttons **closer** to the gauge */}
          <p className="mt-2 font-semibold text-gray-900 text-center">
            Do you want to help save the earth?
          </p>

          {/* Interactive Buttons */}
          <div className="flex space-x-4 mt-1">
            <button
              className={`btn ${
                userChoice === "yes"
                  ? "bg-green-300 text-white border-2 border-green-500 cursor-not-allowed"
                  : "btn-success"
              }`}
              onClick={() => handleGaugeChange("yes")}
              disabled={userChoice === "yes"}
            >
              Yes
            </button>
            <button
              className={`btn ${
                userChoice === "no"
                  ? "bg-red-300 text-white border-2 border-red-500 cursor-not-allowed"
                  : "btn-error"
              }`}
              onClick={() => handleGaugeChange("no")}
              disabled={userChoice === "no"}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <Link to="/sign-in">
          <button className="btn btn-primary">Sign In</button>
        </Link>
        <Link to="/create-account">
          <button className="btn btn-primary">Create New Account</button>
        </Link>
        <Link to="/calculator" className="btn btn-primary">
          Try Calculator
        </Link>
      </div>
    </div>
  );
}
