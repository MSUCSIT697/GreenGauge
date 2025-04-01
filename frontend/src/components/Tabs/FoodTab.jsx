import { useState, useEffect } from "react";
import FormInput from "../FormInput";

export default function FoodTab({ formData, handleChange, showError }) {
  const [diet, setDiet] = useState(formData.food.diet || "omnivore");
  const [composting, setComposting] = useState(formData.food.composting || "no");
  const [foodWasteMethod, setFoodWasteMethod] = useState(formData.food.foodWasteMethod || "");
  const [eatingOut, setEatingOut] = useState(formData.food.eatingOut || "rarely");
  const [localFood, setLocalFood] = useState(formData.food.localFood || "no");
  const [foodExpense, setFoodExpense] = useState(formData.food.foodExpense || "");

  useEffect(() => {
    setDiet(formData.food.diet || "omnivore");
    setComposting(formData.food.composting || "no");
    setFoodWasteMethod(formData.food.foodWasteMethod || "");
    setEatingOut(formData.food.eatingOut || "rarely");
    setLocalFood(formData.food.localFood || "no");
    setFoodExpense(formData.food.foodExpense || "");
  }, [formData.food]);

  return (
    <div>
      <h2 className="text-lg font-semibold">Food</h2>
      
      <label className="block font-medium mb-1">Regular Diet:</label>
      <select
        className={`w-full mt-2 bg-gray-50 border border-gray-300 rounded-md p-2 appearance-auto focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          showError.food ? "border-red-500" : ""
        }`}
        value={diet}
        onChange={(e) => handleChange("food", "diet", e.target.value)}
      >
        <option value="omnivore">Omnivore - heavy on meat</option>
        <option value="vegetarian">Vegetarian - only vegetables</option>
        <option value="vegan">Vegan - only veg and no dairy</option>
        <option value="pescatarian">Pescatarian - includes fish and seafood</option>
      </select>

      <label className="block font-medium mt-4">Do you compost food waste?</label>
      <select
        className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-md p-2 appearance-auto"
        value={composting}
        onChange={(e) => handleChange("food", "composting", e.target.value)}
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      {composting === "yes" && (
        <FormInput
          label="Estimated weekly food waste (lbs):"
          value={formData.food.foodWasteAmount || ""}
          onChange={(e) => handleChange("food", "foodWasteAmount", e.target.value)}
          showError={showError.food}
          type="number"
          min="0"
        />
      )}

      <label className="block font-medium mt-4">How do you dispose of food waste?</label>
      <select
        className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-md p-2 appearance-auto"
        value={foodWasteMethod}
        onChange={(e) => handleChange("food", "foodWasteMethod", e.target.value)}
      >
        <option value="compost">Compost</option>
        <option value="landfill">Landfill</option>
        <option value="recycling">Recycling</option>
        <option value="donation">Donation</option>
      </select>

      <label className="block font-medium mt-4">How often do you eat out?</label>
      <select
        className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-md p-2 appearance-auto"
        value={eatingOut}
        onChange={(e) => handleChange("food", "eatingOut", e.target.value)}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="rarely">Rarely</option>
        <option value="never">Never</option>
      </select>

      <label className="block font-medium mt-4">Do you prioritize locally sourced food?</label>
      <select
        className="w-full mt-2 bg-gray-50 border border-gray-300 rounded-md p-2 appearance-auto"
        value={localFood}
        onChange={(e) => handleChange("food", "localFood", e.target.value)}
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <FormInput
        label="Average monthly food expenses ($):"
        value={foodExpense}
        onChange={(e) => handleChange("food", "foodExpense", e.target.value)}
        showError={showError.food}
        type="number"
        min="0"
      />
    </div>
  );
}
