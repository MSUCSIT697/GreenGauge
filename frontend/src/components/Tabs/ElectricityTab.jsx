import FormInput from "../FormInput";

export default function ElectricityTab({ formData, handleChange, showError }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Electricity</h2>
      <FormInput label="Annual Electricity Consumption (kWh):" value={formData.electricity.consumption_kwh} onChange={(e) => handleChange("electricity", "consumption_kwh", e.target.value)} showError={showError.electricity} />
      <label className="block">Energy Source:</label>
      <select className={`input input-bordered w-full mt-2 ${showError.electricity ? "border-red-500" : ""}`} value={formData.electricity.energy_source} onChange={(e) => handleChange("electricity", "energy_source", e.target.value)}>
        <option value="natural_gas">Natural Gas</option>
        <option value="coal">Coal</option>
        <option value="solar">Solar</option>
        <option value="wind">Wind</option>
        <option value="hydro">Hydro</option>
      </select>
    </div>
  );
}
