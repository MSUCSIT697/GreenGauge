import { useState, useEffect } from "react";
import FormInput from "../FormInput";

export default function ElectricityTab({ formData, handleChange, showError }) {
  // Local state for energy_source
  const [energySource, setEnergySource] = useState(formData.electricity.energy_source);

  // Sync local state with parent when formData changes
  useEffect(() => {
    setEnergySource(formData.electricity.energy_source);
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
      <label className="block mt-4">Energy Source:</label>
      <select
        className={`input input-bordered w-full mt-2 ${
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
