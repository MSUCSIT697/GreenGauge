import { useState } from "react";
import FormInput from "../FormInput";

export default function WasteTab({ formData, handleChange, showError }) {
  const [recycling, setRecycling] = useState(formData.waste.recycling || "");
  const [showRecyclingDropdown, setShowRecyclingDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showEWasteDropdown, setShowEWasteDropdown] = useState(false);
  const [showHazardousDropdown, setShowHazardousDropdown] = useState(false);

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

  const eWasteOptions = [
    "Drop-off at e-waste recycling centers",
    "Trade-in programs",
    "Donation to charities",
    "Municipal e-waste collection events"
  ];

  const recyclingOptions = ["Yes", "No", "Not Sure"];
  
  const hazardousOptions = [
    "Special disposal facility",
    "Hazardous waste collection events",
    "Municipal pickup",
    "Retailer take-back programs",
    "Professional disposal service",
  ];
  const handleSelection = (field, value) => {
    handleChange("waste", field, value);
    switch(field) {
      case "recycling": setShowRecyclingDropdown(false); break;
      case "actions": setShowActionsDropdown(false); break;
      case "eWaste": setShowEWasteDropdown(false); break;
      case "hazardousWaste": setShowHazardousDropdown(false); break;
    }
  };
  
  return (
    <div>
      <h2 className="text-lg font-semibold">Waste Production</h2>

      {/* Waste Inputs */}
      {wasteTypes.map(({ key, label }) => (
        <FormInput
          key={key}
          label={`${label} (lbs per week):`}
          value={formData.waste[key] || ""}
          onChange={(e) => handleChange("waste", key, Math.max(0, e.target.value))}
          showError={showError.waste}
          type="number"
          min="0"
        />
      ))}

      {/* Recycling Question */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Do you recycle your waste?</label>
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Select recycling option"
            value={recycling}
            onClick={() => {
              setShowRecyclingDropdown(!showRecyclingDropdown);
              setShowActionsDropdown(false);
              setShowEWasteDropdown(false);
            }}
            className={`input input-bordered w-full px-3 py-2 border ${
              showError.waste ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {showRecyclingDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300">
              {recyclingOptions.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    recycling === option ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => {
                    setRecycling(option);
                    handleSelection("recycling", option);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Waste Reduction Actions Dropdown */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Are you taking any actions to reduce waste?</label>
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Select an action"
            value={formData.waste.actions || ""}
            onClick={() => {
              setShowActionsDropdown(!showActionsDropdown);
              setShowRecyclingDropdown(false);
              setShowEWasteDropdown(false);
            }}
            className={`input input-bordered w-full px-3 py-2 border ${
              showError.waste ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {showActionsDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300 max-h-60 overflow-auto">
              {wasteReductionActions.map((action) => (
                <div
                  key={action}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    formData.waste.actions === action ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => handleSelection("actions", action)}
                >
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* E-Waste Management */}
      <div className="mb-4">
        <label className="block font-medium mb-1">How do you manage e-waste?</label>
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Select e-waste method"
            value={formData.waste.eWaste || ""}
            onClick={() => {
              setShowEWasteDropdown(!showEWasteDropdown);
              setShowRecyclingDropdown(false);
              setShowActionsDropdown(false);
            }}
            className={`input input-bordered w-full px-3 py-2 border ${
              showError.waste ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {showEWasteDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300">
              {eWasteOptions.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    formData.waste.eWaste === option ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => handleSelection("eWaste", option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hazardous Waste Management */}
      <div className="mb-4">
        <label className="block font-medium mb-1">
          How do you manage hazardous waste (paint, chemicals, etc.)?
        </label>
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Select disposal method"
            value={formData.waste.hazardousWaste || ""}
            onClick={() => {
              setShowHazardousDropdown(!showHazardousDropdown);
              // Close other dropdowns
              setShowRecyclingDropdown(false);
              setShowActionsDropdown(false);
              setShowEWasteDropdown(false);
            }}
            className={`input input-bordered w-full px-3 py-2 border ${
              showError.waste ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {showHazardousDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300 max-h-60 overflow-auto">
              {hazardousOptions.map((option) => (
                <div
                  key={option}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    formData.waste.hazardousWaste === option ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => handleSelection("hazardousWaste", option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}