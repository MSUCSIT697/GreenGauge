import { useState } from "react"; 
import FormInput from "../FormInput";

export default function WasteTab({ formData, handleChange, showError }) {
  const [recycling, setRecycling] = useState(formData.waste.recycling || "No");
  const [unit, setUnit] = useState("kg"); // Default unit is kg

  const handleRecyclingChange = (e) => {
    const value = e.target.value;
    setRecycling(value);
    handleChange("waste", "recycling", value);
  };

  const convertWeight = (value, toUnit) => {
    if (!value) return "";
    return toUnit === "lbs" ? (value * 2.20462).toFixed(2) : (value / 2.20462).toFixed(2);
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    const updatedWaste = {};

    Object.keys(formData.waste).forEach((key) => {
      if (wasteTypes.some((wt) => wt.key === key)) {
        updatedWaste[key] = convertWeight(formData.waste[key], newUnit);
      } else {
        updatedWaste[key] = formData.waste[key];
      }
    });

    setUnit(newUnit);
    handleChange("waste", null, updatedWaste);
  };

  const wasteTypes = [
    { key: "food_waste", label: "Food Waste" },
    { key: "paper", label: "Paper Waste" },
    { key: "plastic", label: "Plastic Waste" },
    { key: "glass", label: "Glass Waste" },
    { key: "metal", label: "Metal Waste" },
  ];

  const wasteReductionActions = [
    "Composting",
    "Buying from local farmers",
    "Cooking at home",
    "Recycling items",
    "Reusing old items",
    "Donating usable items",
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold">Waste Production</h2>

      {/* Unit Toggle */}
      <div className="mb-4">
        <label className="block font-medium">Select Unit:</label>
        <select value={unit} onChange={handleUnitChange} className="border rounded p-2">
          <option value="kg">Kilograms (kg)</option>
          <option value="lbs">Pounds (lbs)</option>
        </select>
      </div>

      {/* Waste Inputs */}
      {wasteTypes.map(({ key, label }) => (
        <FormInput
          key={key}
          label={`${label} (${unit} per week):`}
          value={formData.waste[key]}
          onChange={(e) => handleChange("waste", key, Math.max(0, e.target.value))}
          showError={showError.waste}
          type="number"
        />
      ))}

      {/* Recycling Question */}
      <div>
        <label className="block font-medium">Do you recycle your waste?</label>
        <select value={recycling} onChange={handleRecyclingChange} className="border rounded p-2">
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Not Sure">Not Sure</option>
        </select>
      </div>

      {/* Waste Reduction Actions Dropdown */}
      <div>
        <label className="block font-medium">Are you taking any actions to reduce waste?</label>
        <select
          value={formData.waste.actions || ""}
          onChange={(e) => handleChange("waste", "actions", e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select an action</option>
          {wasteReductionActions.map((action) => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      {/* E-Waste Management */}
      <div>
        <label className="block font-medium">How do you manage e-waste?</label>
        <select
          value={formData.waste.eWaste || ""}
          onChange={(e) => handleChange("waste", "eWaste", e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select a method</option>
          <option value="Drop-off at e-waste recycling centers">Drop-off at e-waste recycling centers</option>
          <option value="Trade-in programs">Trade-in programs</option>
          <option value="Donation to charities">Donation to charities</option>
          <option value="Municipal e-waste collection events">Municipal e-waste collection events</option>
        </select>
      </div>

      {/* Hazardous Waste Management */}
      <div>
        <label className="block font-medium">How do you manage hazardous waste (paint, chemicals, etc.)?</label>
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={formData.waste.hazardousWaste || ""}
          onChange={(e) => handleChange("waste", "hazardousWaste", e.target.value)}
          placeholder="E.g., Special disposal facility, hazardous waste collection events"
        />
      </div>
    </div>
  );
}
