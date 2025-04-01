import { useState } from "react";
import FormInput from "../FormInput";

export default function WasteTab({ formData, handleChange, showError }) {
  const [recycling, setRecycling] = useState(formData.waste.recycling || "No");
  const [recycledTypes, setRecycledTypes] = useState([]);
  const [unit, setUnit] = useState("kg"); // Default unit is kg

  const handleRecyclingChange = (e) => {
    const value = e.target.value;
    setRecycling(value);
    handleChange("waste", "recycling", value);
  };
  const handleRecycledTypesChange = (e) => {
    const { value, checked } = e.target;
    let updatedTypes = [...recycledTypes];

    if (checked) {
      updatedTypes.push(value);
    } else {
      updatedTypes = updatedTypes.filter((type) => type !== value);
    }

    setRecycledTypes(updatedTypes);
    handleChange("waste", "recycledTypes", updatedTypes);
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

      {/* If user recycles, ask what they recycle */}
      {recycling === "Yes" && (
        <div>
          <label className="block font-medium">What types of waste do you recycle?</label>
          <div className="flex flex-wrap">
            {wasteTypes.map(({ key, label }) => (
              <label key={key} className="mr-4">
                <input
                  type="checkbox"
                  value={key}
                  checked={recycledTypes.includes(key)}
                  onChange={handleRecycledTypesChange}
                />{" "}
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Waste Reduction Actions */}
      <div>
        <label className="block font-medium">Are you taking any actions to reduce waste?</label>
        <div className="flex flex-wrap">
          {wasteReductionActions.map((action) => (
            <label key={action} className="mr-4">
              <input
                type="checkbox"
                value={action}
                checked={formData.waste.actions?.includes(action)}
                onChange={(e) =>
                  handleChange(
                    "waste",
                    "actions",
                    e.target.checked
                      ? [...(formData.waste.actions || []), action]
                      : formData.waste.actions.filter((a) => a !== action)
                  )
                }
              />{" "}
              {action}
            </label>
          ))}
        </div>
      </div>

      {/* E-Waste & Hazardous Waste */}
      <div>
        <label className="block font-medium">How do you manage e-waste?</label>
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={formData.waste.eWaste || ""}
          onChange={(e) => handleChange("waste", "eWaste", e.target.value)}
          placeholder="E.g., Drop-off at e-waste recycling centers"
        />
      </div>

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
