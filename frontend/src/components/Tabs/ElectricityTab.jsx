import FormInput from "../FormInput";

export default function ElectricityTab({ formData, handleChange, showError }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Electricity</h2>
      <FormInput label="What is your mothly electricity consumption (in kWh):" value={formData.electricity.consumption} onChange={(e) => handleChange("electricity", "consumption", e.target.value)} showError={showError.electricity} />
      <label className="block">Energy Source:</label>
      <select className={`input input-bordered w-full mt-2 ${showError.electricity ? "border-red-500" : ""}`} value={formData.electricity.energy_source} onChange={(e) => handleChange("electricity", "energy_source", e.target.value)}>
        <option value="natural_gas">Natural Gas</option>
        <option value="coal">Coal</option>
        <option value="petroleum">Petroleum</option>
        <option value="electricity_bill">Monthly Bill in dollars</option>
      </select>
    </div>
  );
}
