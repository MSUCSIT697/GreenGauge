import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResults } from "../context/ResultsContext";
import TransportationTab from "../components/Tabs/TransportationTab";
import ElectricityTab from "../components/Tabs/ElectricityTab";
import FoodTab from "../components/Tabs/FoodTab";
import RetailTab from "../components/Tabs/RetailTab";
import WasteTab from "../components/Tabs/WasteTab";
import Modals from "../components/Modals"; // ✅ Import centralized modals

export default function Calculator() {
  const navigate = useNavigate();
  const { updateResults } = useResults();

  const categories = ["Transportation", "Electricity", "Food", "Retail", "Waste"];
  const [currentTab, setCurrentTab] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [showError, setShowError] = useState({
    zipCode: false,
    transportation: false,
    electricity: false,
    food: false,
    retail: false,
    waste: false,
  });

  const handleZipChange = (zip) => {
    if (/^\d{0,5}$/.test(zip)) {
      setZipCode(zip);
      
      // ✅ If zip code reaches 5 digits, remove the error outline
      if (zip.length === 5) {
        setShowError((prev) => ({ ...prev, zipCode: false }));
      }
    }
  };
  

  const [formData, setFormData] = useState({
    transportation: { car: { distance: "", vehicle_type: "gasoline", passengers: 1 }, truck: { distance: "" }, bus: { distance: "" }, train: { distance: "" } },
    electricity: { consumption_kwh: "", energy_source: "natural_gas" },
    food: { beef: "", chicken: "", vegetables: "", rice: "", pork: "" },
    retail: { electronics: "", clothing: "", toys: "", furniture: "" },
    waste: { food_waste: "", paper: "", plastic: "", glass: "", metal: "" },
  });

  const handleChange = (category, field, value, subField = null) => {
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: subField
            ? { ...prev[category][field], [subField]: value ? parseFloat(value) || 0 : 0 }
            : value ? parseFloat(value) || 0 : 0,
        },
      };
  
      console.log("Updated formData:", updatedFormData); // ✅ Debugging
  
      return updatedFormData;
    });
  };
  
  

  const isFormValid = (data = formData) => {
    if (zipCode.length !== 5) return false;
  
    return Object.keys(data).every((category) =>
      Object.values(data[category]).some((value) => {
        if (typeof value === "object") return Object.values(value).some((sub) => !isNaN(sub) && Number(sub) > 0);
        return !isNaN(value) && Number(value) > 0;
      })
    );
  };
  
  

  const handleSubmit = () => {
    let newErrors = { 
      zipCode: false, 
      transportation: false, 
      electricity: false, 
      food: false, 
      retail: false, 
      waste: false 
    };
    let isValid = true;
  
    // ✅ Ensure Zip Code is Valid
    if (zipCode.length !== 5) {
      newErrors.zipCode = true;
      isValid = false;
    }
  
    // ✅ Check Each Category for at Least One Valid Entry
    Object.keys(formData).forEach((category) => {
      let hasValidEntry = false;
  
      Object.values(formData[category]).forEach((value) => {
        if (typeof value === "object") {
          if (Object.values(value).some((subValue) => !isNaN(subValue) && Number(subValue) > 0)) {
            hasValidEntry = true;
          }
        } else {
          if (!isNaN(value) && Number(value) > 0) {
            hasValidEntry = true;
          }
        }
      });
  
      if (!hasValidEntry) {
        newErrors[category] = true;
        isValid = false;
      }
    });
  
    // ✅ 🚨 Ensure TransportationTab Highlights Correctly
    const transportHasValue = Object.values(formData.transportation).some(
      (vehicle) => vehicle.distance && Number(vehicle.distance) > 0
    );
    if (!transportHasValue) {
      newErrors.transportation = true; // ✅ Mark it as needing highlight
      isValid = false;
    }
  
    // ✅ If Form is Invalid, Show Error Modal and Stop Submission
    if (!isValid) {
      setShowError(newErrors);
      setPopupMessage("⚠️ Please enter your zip code and at least one value per category before submitting.");
      setErrorModal(true);
      return;
    }
  
    // ✅ If Form is Valid, Reset Errors and Proceed
    setShowError({ zipCode: false, transportation: false, electricity: false, food: false, retail: false, waste: false });
    setPopupMessage("Are you sure you want to submit?");
    setConfirmModal(true);
  };
  

  const handleConfirmSubmission = () => {
    if (!isFormValid()) {
      console.log("🚨 Form is STILL INVALID. Blocking submission.");
      return;
    }
    setConfirmModal(false);
    setSuccessModal(true);
  };
  
  

  const handleTabClick = (index) => {
    setCurrentTab(index);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <TransportationTab formData={formData} handleChange={handleChange} showError={showError} />;
      case 1:
        return <ElectricityTab formData={formData} handleChange={handleChange} showError={showError} />;
      case 2:
        return <FoodTab formData={formData} handleChange={handleChange} showError={showError} />;
      case 3:
        return <RetailTab formData={formData} handleChange={handleChange} showError={showError} />;
      case 4:
        return <WasteTab formData={formData} handleChange={handleChange} showError={showError} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Manual Calculator:</h1>
      <p className="text-gray-600 mb-4">Provide the required details to calculate your carbon footprint.</p>

      {/* Zip Code Input */}
      <div className="mb-4">
        <label className="block text-lg font-semibold">Enter your zip code:</label>
        <input
          type="text"
          className={`bg-white input input-bordered w-full mt-2 ${
            showError.zipCode ? "border-red-500" : ""
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
              currentTab === index ? "bg-white font-bold border border-b-0 border-primary" : "hover:bg-white hover:shadow-md"
            }`}
            onClick={() => handleTabClick(index)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow-md rounded-b-lg p-6 -mt-px">{renderTabContent()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {currentTab > 0 && (
          <button className="btn btn-secondary" onClick={() => setCurrentTab(currentTab - 1)}>
            Back
          </button>
        )}
        {currentTab < categories.length - 1 ? (
          <button className="btn btn-primary ml-auto" onClick={() => setCurrentTab(currentTab + 1)}>
            Continue
          </button>
        ) : (
          <button className="btn btn-success ml-auto" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>

      {/* Modals (Centralized) */}
      <Modals
        errorModal={errorModal}
        setErrorModal={setErrorModal}
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
        successModal={successModal}
        setSuccessModal={setSuccessModal}
        popupMessage={popupMessage}
        handleConfirmSubmission={handleConfirmSubmission}
        navigate={navigate}
      />

    </div>
  );
}
