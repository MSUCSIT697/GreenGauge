import FormInput from "../FormInput";

export default function FoodTab({ formData, handleChange, showError }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Food</h2>
      <label className="block">Regular Diet:</label>
      <select className={`input input-bordered w-full mt-2 ${showError.food ? "border-red-500" : ""}`} value={formData.food.diet} onChange={(e) => handleChange("food", "diet", e.target.value)}>
        <option value="omnivore">Omnivore - heavy on meat</option>
        <option value="vegetarian">Vegetarian - only vegetables</option>
        <option value="vegan">Vegan - only veg and no dairy</option>
        <option value="pescatarian">Pescatarian - vegetarian diet but also includes fish and seafood</option>
      </select>
    </div>
  );
}
