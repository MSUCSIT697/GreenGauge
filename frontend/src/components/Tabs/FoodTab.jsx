import FormInput from "../FormInput";

export default function FoodTab({ formData, handleChange, showError }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Food Consumption</h2>
      <FormInput label="Beef (lbs per year):" value={formData.food.beef} onChange={(e) => handleChange("food", "beef", e.target.value)} showError={showError.food} />
      <FormInput label="Chicken (lbs per year):" value={formData.food.chicken} onChange={(e) => handleChange("food", "chicken", e.target.value)} showError={showError.food} />
      <FormInput label="Vegetables (lbs per year):" value={formData.food.vegetables} onChange={(e) => handleChange("food", "vegetables", e.target.value)} showError={showError.food} />
      <FormInput label="Rice (lbs per year):" value={formData.food.rice} onChange={(e) => handleChange("food", "rice", e.target.value)} showError={showError.food} />
      <FormInput label="Pork (lbs per year):" value={formData.food.pork} onChange={(e) => handleChange("food", "pork", e.target.value)} showError={showError.food} />
    </div>
  );
}
