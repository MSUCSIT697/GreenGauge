import { useLocation, useNavigate } from "react-router-dom";
import GaugeChart from "../components/GaugeChart";
import InfoTooltip from "../components/InfoToolTip";


const USA_AVG_TOTAL = 1225;
const GENERAL_SUGGESTIONS = [
  "Turn off unused electronics to reduce energy waste.",
  "Switch to energy-efficient appliances and lighting.",
  "Limit single-use plastic and recycle properly.",
  "Choose public transportation or carpool when possible.",
  "Reduce food waste and compost organic scraps."
];

export default function GuestResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">No guest result found.</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate("/guest-calculator")}>
          Return to Guest Calculator
        </button>
      </div>
    );
  }

  const formattedEmissions = Array.isArray(result.emissions)
    ? Object.fromEntries(result.emissions.map(({ category, value }) => [category, value]))
    : { ...result.emissions };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Your Guest Footprint Results</h1>

      {/* Gauge Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="font-semibold mb-4">Gauge Comparison</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-8 space-y-6 sm:space-y-0">

          <div className="flex flex-col items-center">
            <GaugeChart id="guestGauge" rating={result.total_emissions || 0} />
            <p className="mt-2 font-semibold text-gray-900">Your Emissions</p>
          </div>
          <div className="flex flex-col items-center">
            <GaugeChart id="usAvgGauge" rating={USA_AVG_TOTAL} />
            <p className="mt-2 font-semibold text-gray-900">US Average</p>
          </div>
        </div>
      </div>

      {/* Emissions by Category */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
  Your Emissions by Category
  <InfoTooltip message="Log in to see how your category emissions compare to the U.S. average" />
</h2>

        <ul className="space-y-2 text-gray-700">
          {Object.entries(formattedEmissions).map(([category, value], idx) => (
            <li key={idx}>
              <strong>{category}:</strong> {value} kg CO₂
            </li>
          ))}
        </ul>
      </div>

      {/* General Suggestions */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
  General Suggestions
  <InfoTooltip message="These are default suggestions. Sign in to receive personalized recommendations!" />
</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {GENERAL_SUGGESTIONS.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mt-6 rounded-md text-center">
        <p className="text-lg font-medium mb-3">
          Log in today to use our advanced calculator, track your emissions, and get personalized suggestions!
        </p>
        <button onClick={() => navigate("/sign-in")} className="btn btn-primary">
          Sign up for free!
        </button>
      </div>
    </div>
  );
}
