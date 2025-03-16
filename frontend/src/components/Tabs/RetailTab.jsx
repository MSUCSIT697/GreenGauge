import FormInput from "../FormInput";

export default function RetailTab({ formData, handleChange, showError }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Retail Purchases</h2>
      <FormInput label="Electronics (items per year):" value={formData.retail.electronics} onChange={(e) => handleChange("retail", "electronics", e.target.value)} showError={showError.retail} />
      <FormInput label="Clothing (items per year):" value={formData.retail.clothing} onChange={(e) => handleChange("retail", "clothing", e.target.value)} showError={showError.retail} />
      <FormInput label="Toys (items per year):" value={formData.retail.toys} onChange={(e) => handleChange("retail", "toys", e.target.value)} showError={showError.retail} />
      <FormInput label="Furniture (items per year):" value={formData.retail.furniture} onChange={(e) => handleChange("retail", "furniture", e.target.value)} showError={showError.retail} />
    </div>
  );
}
