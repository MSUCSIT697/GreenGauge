import FormInput from "../FormInput";
import { useState } from 'react';

export default function RetailTab({ formData, handleChange, showError }) {

  const [furnitureType, setFurnitureType] = useState('new'); // Default to 'new'
  const [showFurnitureDropdown, setShowFurnitureDropdown] = useState(false);

  const furnitureOptions = [
    { value: 'new', label: 'New Furniture' },
    { value: 'refurbished', label: 'Refurbished' },
    { value: 'used', label: 'Used' },
    { value: 'rental', label: 'Rental' }
  ];

  const handleFurnitureTypeChange = (type) => {
    setFurnitureType(type);
    setShowFurnitureDropdown(false);
    // handleChange("retail", "furnitureType", type);
  };

  const restrictProps = {
    type: "number",
    min: "0",
    onKeyDown: (e) => {
      if (e.key === "-" || e.key === "e") e.preventDefault();
    },
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Retail Purchases</h2>
      <FormInput
        label="Kids (($) per month):"
        value={formData.retail.kids}
        onChange={(e) => handleChange("retail", "kids", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />
      <FormInput
        label="Clothing (($) per month):"
        value={formData.retail.clothing}
        onChange={(e) => handleChange("retail", "clothing", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />
      <FormInput
        label="Entertainment (($) per month):"
        value={formData.retail.entertainment}
        onChange={(e) => handleChange("retail", "entertainment", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />

      {/* Furniture Input - matches existing style */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Furniture (($) per month):
        </label>
        <div className="flex gap-4">
          {/* Type Dropdown */}
          <div className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                readOnly
                value={furnitureOptions.find(opt => opt.value === furnitureType)?.label || ''}
                onClick={() => setShowFurnitureDropdown(!showFurnitureDropdown)}
                className={`input input-bordered w-full px-3 py-2 border ${
                  showError.retail ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {showFurnitureDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-300">
                {furnitureOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      furnitureType === option.value ? 'bg-gray-100 font-medium' : ''
                    }`}
                    onClick={() => handleFurnitureTypeChange(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Price Input */}
          <div className="flex-1">
            <input
              type="number"
              min="0"
              value={formData.retail.furniture || ''}
              onChange={(e) => handleChange("retail", "furniture", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              className={`input input-bordered w-full px-3 py-2 border ${
                showError.retail ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
            />
          </div>
        </div>
      </div>
      
      <FormInput
        label="Home Supplies (($) per month):"
        value={formData.retail.home_supplies}
        onChange={(e) => handleChange("retail", "home_supplies", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />
      <FormInput
        label="Medical Care (($) per month):"
        value={formData.retail.medical_care}
        onChange={(e) => handleChange("retail", "medical_care", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />
      <FormInput
        label="Personal Care (($) per month):"
        value={formData.retail.personal_care}
        onChange={(e) => handleChange("retail", "personal_care", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />
      <FormInput
        label="Pets (($) per month):"
        value={formData.retail.pets}
        onChange={(e) => handleChange("retail", "pets", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />
      <FormInput
        label="Electronics (($) per month):"
        value={formData.retail.electronics}
        onChange={(e) => handleChange("retail", "electronics", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />
    </div>
  );
}
