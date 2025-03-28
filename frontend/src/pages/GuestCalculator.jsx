import React, { useState } from "react";
import { useResults } from "../context/ResultsContext";
import { useNavigate } from "react-router-dom";
import Modals from "../components/Modals";

export default function GuestCalculator() {
  const navigate = useNavigate();
  const { updateResults } = useResults();
  const [errorModal, setErrorModal] = useState(false);


  const [currentStep, setCurrentStep] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const [electricityType, setElectricityType] = useState("");
  const [hotShower, setHotShower] = useState("");
  const [carOwnership, setCarOwnership] = useState("");
  const [milesOrGas, setMilesOrGas] = useState("");
  const [flyingFrequency, setFlyingFrequency] = useState("");
  const [diet, setDiet] = useState("");
  const [formData, setFormData] = useState({
    electricityValue: "",
    waterBill: "",
    miles: "",
    gasBill: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Allow only non-negative numeric input or empty string
    if (!/^\d*\.?\d*$/.test(value)) return;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async () => {
    const incomplete =
      !electricityType ||
      !formData.electricityValue.trim() ||
      !hotShower ||
      !formData.waterBill.trim() ||
      !carOwnership ||
      (carOwnership === "yes" && !milesOrGas) ||
      (carOwnership === "yes" && milesOrGas === "miles" && !formData.miles.trim()) ||
      (carOwnership === "yes" && milesOrGas === "gas" && !formData.gasBill.trim()) ||
      !flyingFrequency ||
      !diet;
  
    if (incomplete) {
      setPopupMessage("⚠️ Please complete all questions before submitting.");
      setErrorModal(true);
      return;
    }

    const invalidNumbers = [
      formData.electricityValue,
      formData.waterBill,
      formData.miles,
      formData.gasBill,
    ].some((val) => val && (isNaN(val) || Number(val) < 0));
    
    if (invalidNumbers) {
      setPopupMessage("⚠️ Please enter only non-negative numbers for all bill/mileage inputs.");
      setErrorModal(true);
      return;
    }    
  
    const payload = {
      food: {
        omnivore: diet === "omnivore" ? "yes" : "",
        vegetarian: diet === "vegetarian" ? "yes" : "",
        vegan: diet === "vegan" ? "yes" : "",
      },
      flight_travel: {
        very_often: flyingFrequency === "12" ? "yes" : "",
        fairly: flyingFrequency === "6" ? "yes" : "",
        rarely: flyingFrequency === "1" ? "yes" : "",
      },
      car: {
        miles: carOwnership === "yes" && milesOrGas === "miles" ? formData.miles : "",
        gas: carOwnership === "yes" && milesOrGas === "gas" ? formData.gasBill : "",
      },
      water: {
        hot: hotShower === "yes" ? formData.waterBill : "",
        cold: hotShower === "no" ? formData.waterBill : "",
      },
      electricity: {
        power: electricityType === "kWh" ? formData.electricityValue : "",
        bill: electricityType === "dollars" ? formData.electricityValue : "",
      },
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/guest_emissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Guest Calculation successful:", data);
        const guestResult = {
          emissions: data.emissions,
          total_emissions: data.total_emissions,
          recommendations: data.recommendations || [],
          create_ts: new Date().toISOString(),
        };
      
        // ✅ Show success modal instead of immediate redirect
        setPopupMessage("Calculation complete!");
        setSuccessModal(true);
      
        // ✅ Temporarily store guest result for redirection
        sessionStorage.setItem("guestResult", JSON.stringify(guestResult));
      }
      
      
    } catch (err) {
      console.error("🚨 Error:", err);
      setPopupMessage("⚠️ Network error. Please try again.");
      setErrorModal(true);
    }
  };
  

  const steps = [
    {
      label: "Electricity Usage",
      content: (
        <>
          <label className="block text-lg font-medium">How do you track electricity usage?</label>
          <select className="select select-bordered w-full mt-2" value={electricityType} onChange={(e) => setElectricityType(e.target.value)}>
            <option value="">Select...</option>
            <option value="kWh">By kWh (consumption)</option>
            <option value="dollars">By $ per month</option>
          </select>
          <input
            type="text"
            name="electricityValue"
            value={formData.electricityValue}
            onChange={handleChange}
            className="input input-bordered w-full mt-3"
            placeholder="Enter value"
          />
        </>
      ),
    },
    {
      label: "Water Usage",
      content: (
        <>
          <label className="block text-lg font-medium">Do you take hot showers?</label>
          <select className="select select-bordered w-full mt-2" value={hotShower} onChange={(e) => setHotShower(e.target.value)}>
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <input
            type="text"
            name="waterBill"
            value={formData.waterBill}
            onChange={handleChange}
            className="input input-bordered w-full mt-3"
            placeholder="Average water bill per month"
          />
        </>
      ),
    },
    {
      label: "Transportation",
      content: (
        <>
          <label className="block text-lg font-medium">Do you own a car?</label>
          <select className="select select-bordered w-full mt-2" value={carOwnership} onChange={(e) => setCarOwnership(e.target.value)}>
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          {carOwnership === "yes" && (
            <>
              <label className="block mt-3 text-sm font-semibold">How do you want to enter your car data?</label>
              <select className="select select-bordered w-full mt-1" value={milesOrGas} onChange={(e) => setMilesOrGas(e.target.value)}>
                <option value="">Select...</option>
                <option value="miles">By Miles Driven</option>
                <option value="gas">By Gas Bill</option>
              </select>

              {milesOrGas === "miles" && (
                <input
                  type="text"
                  name="miles"
                  className="input input-bordered w-full mt-3"
                  value={formData.miles}
                  onChange={handleChange}
                  placeholder="Enter miles per month"
                />
              )}
              {milesOrGas === "gas" && (
                <input
                  type="text"
                  name="gasBill"
                  className="input input-bordered w-full mt-3"
                  value={formData.gasBill}
                  onChange={handleChange}
                  placeholder="Enter monthly gas bill"
                />
              )}
            </>
          )}
        </>
      ),
    },
    {
      label: "Air Travel",
      content: (
        <>
          <label className="block text-lg font-medium">How often do you fly per year?</label>
          <select className="select select-bordered w-full mt-2" value={flyingFrequency} onChange={(e) => setFlyingFrequency(e.target.value)}>
            <option value="">Select...</option>
            <option value="12">Very Often (12+ trips)</option>
            <option value="6">Fairly Often (6 trips)</option>
            <option value="1">Rarely (1 trip)</option>
          </select>
        </>
      ),
    },
    {
      label: "Diet Type",
      content: (
        <>
          <label className="block text-lg font-medium">What best describes your usual diet?</label>
          <select className="select select-bordered w-full mt-2" value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="">Select...</option>
            <option value="omnivore">Omnivore (includes meat)</option>
            <option value="vegetarian">Vegetarian (no meat)</option>
            <option value="vegan">Vegan (no animal products)</option>
          </select>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Guest Calculator:</h1>
      <p className="text-gray-600 mb-4">Answer a few questions to estimate your carbon footprint.</p>

      {/* Step Display */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{steps[currentStep].label}</h2>
        {steps[currentStep].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {currentStep > 0 && (
          <button className="btn btn-secondary" onClick={() => setCurrentStep((prev) => prev - 1)}>
            Back
          </button>
        )}
        {currentStep < steps.length - 1 ? (
          <button className="btn btn-primary ml-auto" onClick={() => setCurrentStep((prev) => prev + 1)}>
            Continue
          </button>
        ) : (
          <button className="btn btn-success ml-auto" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>

      {/* Success Modal */}
      <Modals
        errorModal={errorModal}
        setErrorModal={setErrorModal}
        confirmModal={false}
        setConfirmModal={() => {}}
        successModal={successModal}
        setSuccessModal={setSuccessModal}
        popupMessage={popupMessage}
        handleConfirmSubmission={() => {}}
        navigate={navigate}
        guestMode={true} // ✅ Enables guest mode routing
      />


      <div className="flex justify-center space-x-4 mt-8">
        <button className="btn btn-outline btn-primary" onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </button>
        <button className="btn btn-outline btn-primary" onClick={() => navigate("/sign-in")}>
          Sign In for Full Access
        </button>
      </div>

    </div>
  );
}
