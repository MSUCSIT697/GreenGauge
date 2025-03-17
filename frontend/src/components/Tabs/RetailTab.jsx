import FormInput from "../FormInput";

export default function RetailTab({ formData, handleChange, showError }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Retail Purchases</h2>
      <FormInput label="Kids (dollars per month):" value={formData.retail.kids} onChange={(e) => handleChange("retail", "kids", e.target.value)} showError={showError.retail} />
      <FormInput label="Clothing (dollars per month):" value={formData.retail.clothing} onChange={(e) => handleChange("retail", "clothing", e.target.value)} showError={showError.retail} />
      <FormInput label="Entertainment (dollars per month):" value={formData.retail.entertainment} onChange={(e) => handleChange("retail", "entertainment", e.target.value)} showError={showError.retail} />
      <FormInput label="Furniture (dollars per month):" value={formData.retail.furniture} onChange={(e) => handleChange("retail", "furniture", e.target.value)} showError={showError.retail} />
      <FormInput label="Home Supplies (dollars per month):" value={formData.retail.home_supplies} onChange={(e) => handleChange("retail", "home_supplies", e.target.value)} showError={showError.retail} />
      <FormInput label="Medical Care (dollars per month):" value={formData.retail.medical_care} onChange={(e) => handleChange("retail", "medical_care", e.target.value)} showError={showError.retail} />
      <FormInput label="Personal Care (dollars per month):" value={formData.retail.personal_care} onChange={(e) => handleChange("retail", "personal_care", e.target.value)} showError={showError.retail} />
      <FormInput label="Pets (dollars per month):" value={formData.retail.pets} onChange={(e) => handleChange("retail", "pets", e.target.value)} showError={showError.retail} />
      <FormInput label="Electronics (dollars per month):" value={formData.retail.electronics} onChange={(e) => handleChange("retail", "electronics", e.target.value)} showError={showError.retail} />
    </div>
  );
}
