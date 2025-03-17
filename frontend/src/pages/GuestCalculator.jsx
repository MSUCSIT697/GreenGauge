import React, { useState } from 'react';
import { useResults } from "../context/ResultsContext";
import { useNavigate } from "react-router-dom";
import Modals from "../components/Modals"; // ✅ Import centralized modals


function GuestCalculator() {
  const navigate = useNavigate();
  const { updateResults } = useResults();
  const [popupMessage, setPopupMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [electricityType, setElectricityType] = useState('');
  const [hotShower, setHotShower] = useState('');
  const [carOwnership, setCarOwnership] = useState('');
  const [milesOrGas, setMilesOrGas] = useState('');
  const [flyingFrequency, setFlyingFrequency] = useState('');
  const [diet, setDiet] = useState('');
  const [formData, setFormData] = useState({
    electricityValue: '',
    waterBill: '',
    miles: '',
    gasBill: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < 4) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      food: {
        omnivore: diet === 'omnivore' ? 'yes' : '',
        vegetarian: diet === 'vegetarian' ? 'yes' : '',
        vegan: diet === 'vegan' ? 'yes' : '',
      },
      flight_travel: {
        very_often: flyingFrequency === '12' ? 'yes' : '',
        fairly: flyingFrequency === '6' ? 'yes' : '',
        rarely: flyingFrequency === '1' ? 'yes' : '',
      },
      car: {
        miles: carOwnership === 'yes' && milesOrGas === 'miles' ? formData.miles : '',
        gas: carOwnership === 'yes' && milesOrGas === 'gas' ? formData.gasBill : '',
      },
      water: {
        hot: hotShower === 'yes' ? formData.waterBill : '',
        cold: hotShower === 'no' ? formData.waterBill : '',
      },
      electricity: {
        power: electricityType === 'kWh' ? formData.electricityValue : '',
        bill: electricityType === 'dollars' ? formData.electricityValue : '',
      },
    };

    console.log('Payload:', payload);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/guest_emissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Calculation successful:', data);

        // ✅ Update the results in context
        updateResults(data);
  
        // ✅ Show success message
        setPopupMessage("✅ Calculation submitted successfully!");
        setSuccessModal(true);
      } else {
        console.error('Calculation failed:', data.error);
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error submitting calculation:', error);
      // Handle network error
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Guest Calculator</h1>
      <p className="text-gray-600 mb-4">Provide the required details to calculate your carbon footprint.</p>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Question Tiles */}
        {currentQuestionIndex === 0 && (
          <div className="tile">
            <h3>What is the average electricity consumption per month?</h3>
            <select
              value={electricityType}
              onChange={(e) => setElectricityType(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="kWh">kWh (consumption)</option>
              <option value="dollars">$/month (bill)</option>
            </select>
            <input
              type="text"
              name="electricityValue"
              value={formData.electricityValue}
              onChange={handleChange}
              placeholder="Enter value"
            />
          </div>
        )}

        {currentQuestionIndex === 1 && (
          <div className="tile">
            <h3>Do you take a hot shower?</h3>
            <select
              value={hotShower}
              onChange={(e) => setHotShower(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {hotShower === 'yes' && (
              <div>
                <label>Enter your average water bill per month:</label>
                <input
                  type="text"
                  name="waterBill"
                  value={formData.waterBill}
                  onChange={handleChange}
                  placeholder="Enter water bill"
                />
              </div>
            )}
          </div>
        )}

        {currentQuestionIndex === 2 && (
          <div className="tile">
            <h3>Do you own a car?</h3>
            <select
              value={carOwnership}
              onChange={(e) => setCarOwnership(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {carOwnership === 'yes' && (
              <>
                <select
                  value={milesOrGas}
                  onChange={(e) => setMilesOrGas(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="miles">Mileage</option>
                  <option value="gas">Gas Bill</option>
                </select>
                {milesOrGas === 'miles' && (
                  <div>
                    <label>Average miles per month:</label>
                    <input
                      type="text"
                      name="miles"
                      value={formData.miles}
                      onChange={handleChange}
                      placeholder="Enter miles per month"
                    />
                  </div>
                )}
                {milesOrGas === 'gas' && (
                  <div>
                    <label>Average gas bill per month:</label>
                    <input
                      type="text"
                      name="gasBill"
                      value={formData.gasBill}
                      onChange={handleChange}
                      placeholder="Enter gas bill per month"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {currentQuestionIndex === 3 && (
          <div className="tile">
            <h3>How often do you fly?</h3>
            <select
              value={flyingFrequency}
              onChange={(e) => setFlyingFrequency(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="12">Very often (12 trips per year)</option>
              <option value="6">Fairly (6 trips per year)</option>
              <option value="1">Rarely (1 trip per year)</option>
            </select>
          </div>
        )}

        {currentQuestionIndex === 4 && (
          <div className="tile">
            <h3>What does your average meal look like?</h3>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="omnivore">Omnivore (heavy on meat)</option>
              <option value="vegetarian">Vegetarian (only vegetables)</option>
              <option value="vegan">Vegan (only veg and no dairy)</option>
            </select>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="navigation-buttons flex justify-between mt-4">
          {currentQuestionIndex > 0 && (
            <button type="button" onClick={handleBack} className="btn btn-secondary">
              Back
            </button>
          )}
          <button type="button" onClick={handleNext} className="btn btn-primary">
            {currentQuestionIndex < 4 ? 'Next' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Modals (Centralized) */}
            <Modals
              successModal={successModal}
              setSuccessModal={setSuccessModal}
              popupMessage={popupMessage}
              navigate={navigate}
            />
    </div>
  );
}

export default GuestCalculator;