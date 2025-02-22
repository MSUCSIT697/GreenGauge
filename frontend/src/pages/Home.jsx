import { useState } from "react";
import { Link } from "react-router-dom";
import GaugeChart from "../components/GaugeChart";

export default function Home() {
  const [rating, setRating] = useState(50); // Default rating
  const [isPositive, setIsPositive] = useState(true); // State to track the current choice
  // const [status, setStatus] = useState(""); // Health Status message

  // Handles button clicks
  const handleGaugeChange = (increase) => {
    if (increase) {
      setRating((prev) => Math.min(prev + 10, 100)); // Max 100
      setIsPositive(false); // No is selected
    } else {
      setRating((prev) => Math.max(prev - 10, 0)); // Min 0
      setIsPositive(true); // Yes is selected
    }
  };

  // Fetches health status from the backend
  // const checkHealth = async () => {
  //   try {
  //     // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
  //     const response = await fetch("https://greengauge.live/api/health");
  //     const data = await response.json();
  //     setStatus(data.status);
  //   } catch (error) {
  //     setStatus("Error fetching health status");
  //   }
  // };

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
        <div className="flex-1 flex flex-col items-center justify-center">
          <GaugeChart rating={rating} />
          <p className="mt-2 font-semibold text-gray-900">
            Do you want to help save the earth?
          </p>

          {/* Interactive Buttons */}
          <div className="flex space-x-4 mt-2">
            <button
              className={`btn ${isPositive ? "btn-accent" : "btn-error"}`}
              onClick={() => handleGaugeChange(false)}
            >
              Yes
            </button>
            <button
              className={`btn ${!isPositive ? "btn-accent" : "btn-error"}`}
              onClick={() => handleGaugeChange(true)}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button className="btn btn-primary">Sign In</button>
        <button className="btn btn-primary">Create New Account</button>
        <Link to="/calculator" className="btn btn-primary">
          Try Calculator
        </Link>
      </div>
    </div>
  );
}
// {/* Health Status */}
{/* <div className="mt-6">
<button onClick={checkHealth} className="btn btn-primary">
  Check Health Status
</button>
<p className="mt-2 text-gray-700">{status}</p>
</div> */}
