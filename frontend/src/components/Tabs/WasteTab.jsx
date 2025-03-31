import FormInput from "../FormInput";

export default function WasteTab({ formData, handleChange, showError }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Waste Production</h2>
      <FormInput label="Food Waste (lbs per week):" value={formData.waste.food_waste} onChange={(e) => handleChange("waste", "food_waste", e.target.value)} showError={showError.waste} />
      <FormInput label="Paper Waste (lbs per week):" value={formData.waste.paper} onChange={(e) => handleChange("waste", "paper", e.target.value)} showError={showError.waste} />
      <FormInput label="Plastic Waste (lbs per week):" value={formData.waste.plastic} onChange={(e) => handleChange("waste", "plastic", e.target.value)} showError={showError.waste} />
      <FormInput label="Glass Waste (lbs per week):" value={formData.waste.glass} onChange={(e) => handleChange("waste", "glass", e.target.value)} showError={showError.waste} />
      <FormInput label="Metal Waste (lbs per week):" value={formData.waste.metal} onChange={(e) => handleChange("waste", "metal", e.target.value)} showError={showError.waste} />
    </div>
  );
}
