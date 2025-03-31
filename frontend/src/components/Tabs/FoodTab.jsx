import { useState, useEffect } from "react";
import FormInput from "../FormInput";

export default function FoodTab({ formData, handleChange, showError }) {
  // Initialize local state with the parent's value or fallback
  const [diet, setDiet] = useState(formData.food.diet || "omnivore");

  // Sync local state with parent when formData changes
  useEffect(() => {
    setDiet(formData.food.diet || "omnivore");
  }, [formData.food.diet]);

  // Handle local changes and sync with parent
  const handleDietChange = (value) => {
    setDiet(value);
    handleChange("food", "diet", value);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Food</h2>
      <label className="block font-medium mb-1">Regular Diet:</label>
      <select
        className={`w-full mt-2 bg-gray-50 border border-gray-300 rounded-md p-2 appearance-auto focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          showError.food ? "border-red-500" : ""
        }`}
        value={diet}
        onChange={(e) => handleDietChange(e.target.value)}
      >
        <option value="omnivore">Omnivore - heavy on meat</option>
        <option value="vegetarian">Vegetarian - only vegetables</option>
        <option value="vegan">Vegan - only veg and no dairy</option>
        <option value="pescatarian">
          Pescatarian - vegetarian diet but also includes fish and seafood
        </option>
      </select>
    </div>
  );
}