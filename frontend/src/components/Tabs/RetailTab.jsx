import FormInput from "../FormInput";

export default function RetailTab({ formData, handleChange, showError }) {
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
      <FormInput
        label="Furniture (($) per month):"
        value={formData.retail.furniture}
        onChange={(e) => handleChange("retail", "furniture", e.target.value)}
        showError={showError.retail}
        {...restrictProps}
      />
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
