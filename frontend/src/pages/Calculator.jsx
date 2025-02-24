import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Calculator() {
  const navigate = useNavigate();

  const categories = ["Transportation", "Electricity", "Food", "Retail", "Waste"];
  const [currentTab, setCurrentTab] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [confirmingSubmission, setConfirmingSubmission] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [submissionError, setSubmissionError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);

  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const validNJZipCodes = [/^07/, /^08/];
  const [isFromNJ, setIsFromNJ] = useState(false);

  const handleZipChange = (zip) => {
    if (/^\d{0,5}$/.test(zip)) {
      setZipCode(zip);
      if (zip.length === 5) {
        setIsFromNJ(validNJZipCodes.some((regex) => regex.test(zip)));
      }
    }
  };

  const [formData, setFormData] = useState({
    transportation: {
      car: { distance: "", vehicle_type: "gasoline", passengers: 1 },
      truck: { distance: "", passengers: 1 },
      bus: { distance: "", passengers: 10 },
      train: { distance: "", passengers: 50 },
    },
    electricity: { consumption_kwh: "", energy_source: "natural_gas" },
    food: { beef: "", chicken: "", vegetables: "", rice: "", pork: "" },
    retail: { electronics: "", clothing: "", toys: "", furniture: "" },
    waste: { food_waste: "", paper: "", plastic: "", glass: "", metal: "" },
  });

  const handleChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const isFormValid = () => {
    return Object.values(formData).every((category) =>
      Object.values(category).every((value) => value !== "")
    );
  };

  const handleNext = () => {
    setCurrentTab(currentTab + 1);
  };

  const handleSubmit = () => {
    const allFieldsFilled = isFormValid();

    if (zipCode.length !== 5 || !allFieldsFilled) {
      setShowError(true);
      setPopupMessage("Please fill all fields before submitting.");
      window.location.href = "#error_modal";
      return;
    }

    setPopupMessage("Are you sure you want to submit?");
    setConfirmingSubmission(true);
    window.location.href = "#confirm_modal";
  };

  const confirmSubmission = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API request

      setSuccessModal(true);
      setIsSubmitted(true);
      window.location.href = "#success_modal";
    } catch (error) {
      console.error("Error submitting data:", error);
      setErrorModal(true);
      window.location.href = "#error_modal";
    }
  };

  const handleTabClick = (index) => {
    setCurrentTab(index);
  };

  const isTabValid = () => {
    return Object.values(formData[categories[currentTab].toLowerCase()]).every(
      (value) => value !== ""
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Manual Calculator:</h1>
      <p className="text-gray-600 mb-4">
        Please answer the questions below. The more information you provide, the better the accuracy!
      </p>

      {/* Zip Code Input */}
      <div className="mb-4">
        <label className="block text-lg font-semibold">Enter your zip code:</label>
        <input
          type="text"
          className={`input input-bordered w-full mt-2 ${
            showError && zipCode.length !== 5 ? "border-red-500" : ""
          }`}
          value={zipCode}
          onChange={(e) => handleZipChange(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-0">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={`px-6 py-2 text-lg rounded-t-md transition-all ${
              currentTab === index
                ? "bg-white font-bold border border-b-0 border-gray-300"
                : "hover:bg-white hover:shadow-md"
            }`}
            onClick={() => handleTabClick(index)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow-md rounded-b-lg p-6 -mt-px">
        {currentTab === 0 && (
          <div>
            <h2 className="text-lg font-semibold">Transportation</h2>
            <label className="block">Car Distance (miles):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.transportation.car.distance === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.transportation.car.distance}
              onChange={(e) =>
                handleChange("transportation", "car", {
                  ...formData.transportation.car,
                  distance: e.target.value,
                })
              }
            />
            <label className="block">Truck Distance (miles):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.transportation.truck.distance === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.transportation.truck.distance}
              onChange={(e) =>
                handleChange("transportation", "truck", {
                  ...formData.transportation.truck,
                  distance: e.target.value,
                })
              }
            />
            <label className="block">Bus Distance (miles):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.transportation.bus.distance === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.transportation.bus.distance}
              onChange={(e) =>
                handleChange("transportation", "bus", {
                  ...formData.transportation.bus,
                  distance: e.target.value,
                })
              }
            />
            <label className="block">Train Distance (miles):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.transportation.train.distance === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.transportation.train.distance}
              onChange={(e) =>
                handleChange("transportation", "train", {
                  ...formData.transportation.train,
                  distance: e.target.value,
                })
              }
            />
          </div>
        )}

        {currentTab === 1 && (
          <div>
            <h2 className="text-lg font-semibold">Electricity</h2>
            <label className="block">Annual Electricity Consumption (kWh):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.electricity.consumption_kwh === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.electricity.consumption_kwh}
              onChange={(e) =>
                handleChange("electricity", "consumption_kwh", e.target.value)
              }
            />
            <label className="block">Energy Source:</label>
            <select
              className={`input input-bordered w-full mt-2 ${
                showError && formData.electricity.energy_source === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.electricity.energy_source}
              onChange={(e) =>
                handleChange("electricity", "energy_source", e.target.value)
              }
            >
              <option value="natural_gas">Natural Gas</option>
              <option value="coal">Coal</option>
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="hydro">Hydro</option>
            </select>
          </div>
        )}

        {currentTab === 2 && (
          <div>
            <h2 className="text-lg font-semibold">Food Consumption</h2>
            <label className="block">Beef (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.food.beef === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.food.beef}
              onChange={(e) => handleChange("food", "beef", e.target.value)}
            />
            <label className="block">Chicken (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.food.chicken === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.food.chicken}
              onChange={(e) => handleChange("food", "chicken", e.target.value)}
            />
            <label className="block">Vegetables (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.food.vegetables === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.food.vegetables}
              onChange={(e) => handleChange("food", "vegetables", e.target.value)}
            />
            <label className="block">Rice (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.food.rice === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.food.rice}
              onChange={(e) => handleChange("food", "rice", e.target.value)}
            />
            <label className="block">Pork (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.food.pork === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.food.pork}
              onChange={(e) => handleChange("food", "pork", e.target.value)}
            />
          </div>
        )}

        {currentTab === 3 && (
          <div>
            <h2 className="text-lg font-semibold">Retail Purchases</h2>
            <label className="block">Electronics (items per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.retail.electronics === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.retail.electronics}
              onChange={(e) => handleChange("retail", "electronics", e.target.value)}
            />
            <label className="block">Clothing (items per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.retail.clothing === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.retail.clothing}
              onChange={(e) => handleChange("retail", "clothing", e.target.value)}
            />
            <label className="block">Toys (items per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.retail.toys === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.retail.toys}
              onChange={(e) => handleChange("retail", "toys", e.target.value)}
            />
            <label className="block">Furniture (items per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.retail.furniture === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.retail.furniture}
              onChange={(e) => handleChange("retail", "furniture", e.target.value)}
            />
          </div>
        )}

        {currentTab === 4 && (
          <div>
            <h2 className="text-lg font-semibold">Waste Production</h2>
            <label className="block">Food Waste (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.waste.food_waste === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.waste.food_waste}
              onChange={(e) => handleChange("waste", "food_waste", e.target.value)}
            />
            <label className="block">Paper Waste (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.waste.paper === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.waste.paper}
              onChange={(e) => handleChange("waste", "paper", e.target.value)}
            />
            <label className="block">Plastic Waste (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.waste.plastic === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.waste.plastic}
              onChange={(e) => handleChange("waste", "plastic", e.target.value)}
            />
            <label className="block">Glass Waste (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.waste.glass === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.waste.glass}
              onChange={(e) => handleChange("waste", "glass", e.target.value)}
            />
            <label className="block">Metal Waste (lbs per year):</label>
            <input
              type="number"
              className={`input input-bordered w-full mt-2 ${
                showError && formData.waste.metal === ""
                  ? "border-red-500"
                  : ""
              }`}
              value={formData.waste.metal}
              onChange={(e) => handleChange("waste", "metal", e.target.value)}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentTab > 0 && (
            <button className="btn btn-secondary" onClick={() => setCurrentTab(currentTab - 1)}>
              Back
            </button>
          )}
          {currentTab < categories.length - 1 ? (
            <button className="btn btn-primary ml-auto" onClick={handleNext}>
              Continue
            </button>
          ) : (
            <button className="btn btn-success ml-auto" onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className="modal" id="confirm_modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Confirm Submission</h3>
          <p className="py-4">{popupMessage}</p>
          <div className="modal-action">
            <button className="btn" onClick={confirmSubmission}>
              Confirm
            </button>
            <a href="#" className="btn">
              Cancel
            </a>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <div className="modal" id="error_modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Error</h3>
          <p className="py-4">Please fill all fields before submitting.</p>
          <div className="modal-action">
            <a href="#" className="btn">
              Close
            </a>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <div className="modal" id="success_modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Submission Successful</h3>
          <p>Your results will be displayed on the next page.</p>
          <div className="modal-action">
            <button onClick={() => navigate("/results")} className="btn">
              View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
