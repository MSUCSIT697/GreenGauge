import { useState, useEffect } from "react";
import FormInput from "../FormInput";
import InfoTooltip from "../InfoToolTip";

export default function TransportationTab({ formData, handleChange, showError }) {
  const [vehicleType, setVehicleType] = useState(
    (formData.transportation.vehicle_type || "gasoline").toLowerCase()
  );

  useEffect(() => {
    setVehicleType((formData.transportation.vehicle_type || "gasoline").toLowerCase());
  }, [formData.transportation.vehicle_type]);

  const handleVehicleTypeChange = (value) => {
    setVehicleType(value);
    handleChange("transportation", "vehicle_type", value);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Transportation</h2>

      {/* Housemates */}
      <FormInput
        label="Number of Housemates (including yourself):"
        value={formData.transportation.housemate_count || ""}
        onChange={(e) => handleChange("transportation", "housemate_count", e.target.value)}
        showError={showError.transportation}
        type="number"
        isMonetary={false}
        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
        placeholder="1"
      />

      {/* Car Distance */}
      <FormInput
        label={
          <span className="flex items-center gap-2">
            Car Distance (miles per month)
            <InfoTooltip
              position="right"
              message="Estimate how many miles you typically drive each month. Enter 0 if you don’t drive."
            />
          </span>
        }
        value={formData.transportation.car?.distance || ""}
        onChange={(e) => handleChange("transportation", "car", e.target.value, "distance")}
        showError={showError.transportation}
        type="number"
        isMonetary={false}
        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
        placeholder="0"
      />

      {/* Car Passengers */}
      <FormInput
        label={
          <span className="flex items-center gap-2">
            Avg. Passengers per Car Trip
            <InfoTooltip
              position="right"
              message="Include yourself when entering the average number of people per ride."
            />
          </span>
        }
        value={formData.transportation.car?.passengers || ""}
        onChange={(e) => handleChange("transportation", "car", e.target.value, "passengers")}
        showError={showError.transportation}
        type="number"
        isMonetary={false}
        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
        placeholder="1"
      />

      {/* Car Type */}
      <label className="block font-medium mb-1 mt-4">Car Type:</label>
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

      {/* Public Transit & Flights (no tooltip needed — labels are clear) */}
      <FormInput
        label="Monthly Subway Bill ($):"
        value={formData.transportation.subway?.cost || ""}
        onChange={(e) => handleChange("transportation", "subway", e.target.value, "cost")}
        showError={showError.transportation}
        type="number"
        isMonetary={true}
        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
        placeholder="0"
      />

      <FormInput
        label="Monthly Bus Bill ($):"
        value={formData.transportation.bus?.cost || ""}
        onChange={(e) => handleChange("transportation", "bus", e.target.value, "cost")}
        showError={showError.transportation}
        type="number"
        isMonetary={true}
        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
        placeholder="0"
      />

      <FormInput
        label="Monthly Train Bill ($):"
        value={formData.transportation.train?.cost || ""}
        onChange={(e) => handleChange("transportation", "train", e.target.value, "cost")}
        showError={showError.transportation}
        type="number"
        isMonetary={true}
        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
        placeholder="0"
      />

      <FormInput
        label="Monthly Domestic Flights Bill ($):"
        value={formData.transportation.domestic_flight?.cost || ""}
        onChange={(e) => handleChange("transportation", "domestic_flight", e.target.value, "cost")}
        showError={showError.transportation}
        type="number"
        isMonetary={true}
        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
        placeholder="0"
      />

      <FormInput
        label="Monthly International Flights Bill ($):"
        value={formData.transportation.international_flight?.cost || ""}
        onChange={(e) => handleChange("transportation", "international_flight", e.target.value, "cost")}
        showError={showError.transportation}
        type="number"
        isMonetary={true}
        onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
        placeholder="0"
      />
    </div>
  );
}
