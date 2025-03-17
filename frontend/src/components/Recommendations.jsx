import React, { useState, useEffect } from "react";

// ✅ Moved `generateRecommendations` outside of the component & added default suggestions
export const generateRecommendations = (emissionsData = {}) => {
    if (!emissionsData || typeof emissionsData !== "object") {
        console.warn("⚠️ Invalid emissions data received, returning empty recommendations.");
        return [];
    }

    const categoryAverages = {
        "Transportation": { min: 5000, max: 6000, avg: 5500 },
        "Energy Use": { min: 4000, max: 5000, avg: 4500 },
        "Food and Diet": { min: 2000, max: 3000, avg: 2500 },
        "Goods and Services": { min: 2000, max: 3000, avg: 2500 },
        "Waste": { min: 500, max: 1000, avg: 750 }
    };

    const suggestions = {
        "Transportation": {
            positive: ["You're using transport efficiently! Keep it up.", "Consider continuing to use public transport or biking."],
            moderate: ["Carpooling a few times a week could lower your footprint.", "Consider switching to an electric or hybrid vehicle."],
            strong: ["Try reducing solo car trips and opt for greener alternatives.", "Switching to public transport can cut emissions significantly."]
        },
        "Energy Use": {
            positive: ["Your energy use is efficient! Keep up the great work.", "You're making a difference! Consider upgrading to efficient appliances."],
            moderate: ["Switching to LED bulbs and energy-efficient appliances can help.", "Turning off unused electronics can further reduce emissions."],
            strong: ["Reducing heating/cooling use can lower emissions significantly.", "Switching to renewable energy sources would be a great step forward."]
        },
        "Food and Diet": {
            positive: ["You're making great food choices for the environment!", "Your diet has a low carbon footprint—keep it up!"],
            moderate: ["Reducing food waste can further improve your impact.", "Eating more plant-based meals can lower emissions."],
            strong: ["Consider cutting back on red meat to lower emissions.", "Reducing food waste is a great way to cut your carbon footprint."]
        },
        "Goods and Services": {
            positive: ["You're doing well with responsible consumption!", "Great job prioritizing sustainable products!"],
            moderate: ["Buying second-hand items can further reduce emissions.", "Repairing instead of replacing saves money and emissions."],
            strong: ["Try reducing unnecessary purchases to lower your footprint.", "Opt for digital over physical products when possible."]
        },
        "Waste": {
            positive: ["You're managing waste efficiently—keep it up!", "Great job minimizing waste and recycling properly!"],
            moderate: ["Composting food waste can further reduce emissions.", "Reducing plastic usage can lower waste impact."],
            strong: ["Try recycling properly to minimize landfill waste.", "Reducing single-use plastics is a great step forward."]
        }
    };

    const allSuggestions = Object.keys(emissionsData).flatMap(category => {
        const userValue = emissionsData[category] ?? 0;
        const avgData = categoryAverages[category] || { min: 0, avg: 0, max: 0 };
    
        if (!suggestions[category]) return [];
        if (userValue < avgData.min) return suggestions[category].positive;
        if (userValue < avgData.avg) return suggestions[category].moderate;
        return suggestions[category].strong;
    });
    
    // ✅ Ensure at least one suggestion is returned
    if (allSuggestions.length === 0) {
        return ["Consider reducing your carbon footprint in various categories."];
    }

    // ✅ Select only 3 random suggestions
    return allSuggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
};    


// ✅ Main Recommendation System Component
const RecommendationSystem = ({ emissions, storedRecommendations = [] }) => {
    const [error, setError] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        console.log("📌 Checking emissions before processing:", emissions);
    
        if (!emissions || typeof emissions !== "object") {
            console.warn("⚠️ Emissions data is invalid. Setting error.");
            setError(true);
            return;
        }
    
        if (Object.keys(emissions).length === 0) {
            console.warn("⚠️ Emissions object is empty. No recommendations available.");
            setRecommendations([]);
            return;
        }
    
        try {
            const newRecommendations = storedRecommendations.length > 0 
                ? storedRecommendations 
                : generateRecommendations(emissions).slice(0, 3); // ✅ Fix: Limit to 3
            
            console.log("📌 Generated recommendations:", newRecommendations);
            setRecommendations(newRecommendations);
        } catch (err) {
            console.error("🚨 Error generating recommendations:", err);
            setError(true);
        }
    }, [emissions, storedRecommendations]);
    

    if (error) {
        return (
            <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Your Carbon Footprint Report & Recommendations</h2>
                <p className="text-red-600 font-semibold">
                    ⚠️ Oops! Unable to retrieve emissions data. Using default recommendations.
                </p>
                <ul className="list-disc pl-4 text-gray-700">
                    <li>Reduce car trips by carpooling or using public transport.</li>
                    <li>Switch to LED bulbs for energy efficiency.</li>
                    <li>Eat more plant-based meals to lower carbon impact.</li>
                </ul>
            </div>
        );
    }

    return (
        <ul className="list-disc pl-4">
            {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-700">- {rec}</li>
                ))
            ) : (
                <p className="text-gray-500">Perform a calculation to receive personalized recommendations.</p>
            )}
        </ul>
    );
};

// ✅ Export both the component and function
export default RecommendationSystem;
export { RecommendationSystem }; // ✅ Named export for consistency

