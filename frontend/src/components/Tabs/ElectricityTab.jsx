import { useState, useEffect } from "react";
import FormInput from "../FormInput";

export default function ElectricityTab({ formData, handleChange, showError }) {
  // Local state for energy_source with a fallback value
  const [energySource, setEnergySource] = useState(
    formData.electricity.energy_source || "natural_gas"
  );

  // Sync local state with parent when formData changes
  useEffect(() => {
    setEnergySource(formData.electricity.energy_source || "natural_gas");
  }, [formData.electricity.energy_source]);

  // Handle local changes and sync with parent
  const handleEnergySourceChange = (value) => {
    setEnergySource(value);
    handleChange("electricity", "energy_source", value);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Electricity</h2>
      <FormInput
        label="What is your monthly electricity consumption (in kWh):"
        type="number"
        min="0"
        value={formData.electricity.consumption}
        onChange={(e) =>
          handleChange("electricity", "consumption", e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "e") e.preventDefault();
        }}
        showError={showError.electricity}
      />
      <label className="block font-medium mb-1">Energy Source:</label>
      <select
        className={`w-full mt-2 bg-gray-50 border border-gray-300 rounded-md p-2 appearance-auto focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          showError.electricity ? "border-red-500" : ""
        }`}
        value={energySource}
        onChange={(e) => handleEnergySourceChange(e.target.value)}
      >
        <option value="natural_gas">Natural Gas</option>
        <option value="coal">Coal</option>
        <option value="petroleum">Petroleum</option>
        <option value="electricity_bill">Electricity</option>
      </select>
    </div>
  );
}