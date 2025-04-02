import { useState } from "react";
import FormInput from "../FormInput";

export default function FoodTab({ formData, handleChange, showError }) {
  const [showDietDropdown, setShowDietDropdown] = useState(false);
  const [showEatingOutDropdown, setShowEatingOutDropdown] = useState(false);
  const [showLocalFoodDropdown, setShowLocalFoodDropdown] = useState(false);

  const dietOptions = [
    { value: "omnivore", label: "Omnivore - heavy on meat" },
    { value: "vegetarian", label: "Vegetarian - only vegetables" },
    { value: "vegan", label: "Vegan - only veg and no dairy" },
    { value: "pescatarian", label: "Pescatarian - includes fish and seafood" }
  ];

  const eatingOutOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "rarely", label: "Rarely" },
    { value: "never", label: "Never" }
  ];

  const localFoodOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" }
  ];

  const handleSelection = (field, value) => {
    handleChange("food", field, value);
    // Close the dropdown immediately after selection
    switch(field) {
      case "diet":
        setShowDietDropdown(false);
        break;
      case "eatingOut":
        setShowEatingOutDropdown(false);
        break;
      case "localFood":
        setShowLocalFoodDropdown(false);
        break;
    }
  };

  // Get current values from formData with fallbacks
  const currentDiet = formData.food?.diet || "";
  const currentEatingOut = formData.food?.eatingOut || "";
  const currentLocalFood = formData.food?.localFood || "";
  const currentExpense = formData.food?.foodExpense || "";

  return (
    <div>
      <h2 className="text-lg font-semibold">Food</h2>
      
      {/* Diet Selection */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Regular Diet:</label>
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Select your diet"
            value={dietOptions.find(opt => opt.value === currentDiet)?.label || ''}
            onClick={() => {
              setShowDietDropdown(!showDietDropdown);
              // Close other dropdowns when opening this one
              setShowEatingOutDropdown(false);
              setShowLocalFoodDropdown(false);
            }}
            className={`input input-bordered w-full px-3 py-2 border ${
              showError.food ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {showDietDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300 max-h-60 overflow-auto">
              {dietOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    currentDiet === option.value ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => handleSelection("diet", option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Eating Out Frequency */}
      <div className="mb-4">
        <label className="block font-medium mb-1">How often do you eat out?</label>
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Select frequency"
            value={eatingOutOptions.find(opt => opt.value === currentEatingOut)?.label || ''}
            onClick={() => {
              setShowEatingOutDropdown(!showEatingOutDropdown);
              setShowDietDropdown(false);
              setShowLocalFoodDropdown(false);
            }}
            className={`input input-bordered w-full px-3 py-2 border ${
              showError.food ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {showEatingOutDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300 max-h-60 overflow-auto">
              {eatingOutOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    currentEatingOut === option.value ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => handleSelection("eatingOut", option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Local Food Preference */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Do you prioritize locally sourced food?</label>
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Select preference"
            value={localFoodOptions.find(opt => opt.value === currentLocalFood)?.label || ''}
            onClick={() => {
              setShowLocalFoodDropdown(!showLocalFoodDropdown);
              setShowDietDropdown(false);
              setShowEatingOutDropdown(false);
            }}
            className={`input input-bordered w-full px-3 py-2 border ${
              showError.food ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
          />
          {showLocalFoodDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300">
              {localFoodOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    currentLocalFood === option.value ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => handleSelection("localFood", option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Food Expenses */}
      <FormInput
        label="Average monthly food expenses ($):"
        value={currentExpense}
        onChange={(e) => handleChange("food", "foodExpense", e.target.value)}
        showError={showError.food}
        type="number"
        min="0"
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
        }}
      />
    </div>
  );
}