import { useState, useEffect } from "react";
import FormInput from "../FormInput";
import InfoTooltip from "../InfoToolTip";

export default function ElectricityTab({ formData, handleChange, showError }) {
  const [energySource, setEnergySource] = useState(
    formData.electricity.energy_source || "natural_gas"
  );

  useEffect(() => {
    setEnergySource(formData.electricity.energy_source || "natural_gas");
  }, [formData.electricity.energy_source]);

  const handleEnergySourceChange = (value) => {
    setEnergySource(value);
    handleChange("electricity", "energy_source", value);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Electricity</h2>

      {/* ✅ Tooltip added inside FormInput label */}
      <FormInput
        label={
          <div className="inline-flex items-center gap-1">
            What is your monthly electricity consumption (in kWh):
            <InfoTooltip message="You can find this on your electricity bill. kWh stands for kilowatt-hours, a measure of your total electricity usage." />
          </div>
        }
        
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

      {/* ✅ Tooltip added inside label for dropdown */}
      <label className="inline-flex items-center gap-1 font-medium mb-1">
  Energy Source:
  <InfoTooltip message="Select the main fuel type used to generate your electricity. This helps us estimate emissions more accurately." />
</label>

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