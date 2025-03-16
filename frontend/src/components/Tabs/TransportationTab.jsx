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

      <FormInput 
        label="Truck Distance (miles):" 
        value={formData.transportation.truck.distance} 
        onChange={(e) => handleChange("transportation", "truck", e.target.value, "distance")}  
        showError={showError.transportation}  
      />

      <FormInput 
        label="Bus Distance (miles):" 
        value={formData.transportation.bus.distance} 
        onChange={(e) => handleChange("transportation", "bus", e.target.value, "distance")}  
        showError={showError.transportation}  
      />

      <FormInput 
        label="Train Distance (miles):" 
        value={formData.transportation.train.distance} 
        onChange={(e) => handleChange("transportation", "train", e.target.value, "distance")}  
        showError={showError.transportation}  
      />
    </div>
  );
}
