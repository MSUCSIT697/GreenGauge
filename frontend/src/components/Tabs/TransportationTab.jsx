import FormInput from "../FormInput";

export default function TransportationTab({ formData, handleChange, showError }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Transportation</h2>
      
      <FormInput 
        label="Car Distance (miles):" 
        value={formData.transportation.car.distance} 
        onChange={(e) => handleChange("transportation", "car", e.target.value, "distance")}  
        showError={showError.transportation}  // ✅ Now properly triggers red highlight
      />
      <label className="block">Car Type:</label>
      <select className={`input input-bordered w-full mt-2 ${showError.transportation ? "border-red-500" : ""}`} value={formData.transportation.vehicle_type} onChange={(e) => handleChange("transportation", "vehicle_type", e.target.value)}>
        <option value="gasoline">Gasoline</option>
        <option value="diesel">Diesel</option>
        <option value="electric">Electric</option>
      </select>

      <FormInput 
        label="Subway (monthly expenditure in dollars):" 
        value={formData.transportation.subway.cost} 
        onChange={(e) => handleChange("transportation", "subway", e.target.value, "cost")}  
        showError={showError.transportation}  
      />

      <FormInput 
        label="Bus (monthly expenditure in dollars):" 
        value={formData.transportation.bus.cost} 
        onChange={(e) => handleChange("transportation", "bus", e.target.value, "cost")}  
        showError={showError.transportation}  
      />

      <FormInput 
        label="Train (monthly expenditure in dollars):" 
        value={formData.transportation.train.cost} 
        onChange={(e) => handleChange("transportation", "train", e.target.value, "cost")}  
        showError={showError.transportation}  
      />

      <FormInput 
        label="Domestic Flights (monthly expenditure in dollars):" 
        value={formData.transportation.domestic_flight.cost} 
        onChange={(e) => handleChange("transportation", "domestic_flight", e.target.value, "cost")}  
        showError={showError.transportation}  
      />

      <FormInput 
        label="International Flights (monthly expenditure in dollars):" 
        value={formData.transportation.international_flight.cost} 
        onChange={(e) => handleChange("transportation", "international_flight", e.target.value, "cost")}  
        showError={showError.transportation}  
      />
    </div>
  );
}
