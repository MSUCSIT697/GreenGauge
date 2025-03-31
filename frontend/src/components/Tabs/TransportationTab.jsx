import { useState, useEffect } from "react";
import FormInput from "../FormInput";

export default function TransportationTab({ formData, handleChange, showError }) {
  const [vehicleType, setVehicleType] = useState(
    (formData.transportation.vehicle_type || "gasoline").toLowerCase()
  );

  useEffect(() => {
    setVehicleType((formData.transportation.vehicle_type || "gasoline").toLowerCase());
  }, [formData.transportation.vehicle_type]);

  const handleVehicleTypeChange = (value) => {
    console.log("Selected value:", value);
    setVehicleType(value);
    handleChange("transportation", "vehicle_type", value);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Transportation</h2>

      <FormInput
        label="Car Distance (miles):"
        value={formData.transportation.car.distance}
        onChange={(e) =>
          handleChange("transportation", "car", e.target.value, "distance")
        }
        showError={showError.transportation}
      />

      <label className="block font-medium mb-1">Car Type:</label>
      <select
        className={`w-full mt-2 bg-gray-50 border border-gray-300 rounded-md p-2 appearance-auto focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          showError.transportation ? "border-red-500" : ""
        }`}
        value={vehicleType}
        onChange={(e) => handleVehicleTypeChange(e.target.value)}
      >
        <option value="gasoline">Gasoline</option>
        <option value="diesel">Diesel</option>
        <option value="electric">Electric</option>
      </select>

      <FormInput
        label="Subway (monthly expenditure in dollars):"
        value={formData.transportation.subway.cost}
        onChange={(e) =>
          handleChange("transportation", "subway", e.target.value, "cost")
        }
        showError={showError.transportation}
      />

      <FormInput
        label="Bus (monthly expenditure in dollars):"
        value={formData.transportation.bus.cost}
        onChange={(e) =>
          handleChange("transportation", "bus", e.target.value, "cost")
        }
        showError={showError.transportation}
      />

      <FormInput
        label="Train (monthly expenditure in dollars):"
        value={formData.transportation.train.cost}
        onChange={(e) =>
          handleChange("transportation", "train", e.target.value, "cost")
        }
        showError={showError.transportation}
      />

      <FormInput
        label="Domestic Flights (monthly expenditure in dollars):"
        value={formData.transportation.domestic_flight.cost}
        onChange={(e) =>
          handleChange("transportation", "domestic_flight", e.target.value, "cost")
        }
        showError={showError.transportation}
      />

      <FormInput
        label="International Flights (monthly expenditure in dollars):"
        value={formData.transportation.international_flight.cost}
        onChange={(e) =>
          handleChange("transportation", "international_flight", e.target.value, "cost")
        }
        showError={showError.transportation}
      />
    </div>
  );
}