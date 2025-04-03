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
            positive: [
                "You're doing great with transportation! Keep it up and consider biking for short trips.",
                "Excellent progress! Try maintaining low emissions by continuing to use public transport.",
                "You're making smart choices! You could reduce occasional air travel for even better impact."
            ],
            moderate: [
                "Carpooling a few times a week could lower your footprint.",
                "Consider switching to an electric or hybrid vehicle.",
                "Using public transport more often can help reduce emissions."
            ],
            strong: [
                "Try reducing solo car trips and opt for greener alternatives.",
                "Switching to public transport can cut emissions significantly.",
                "Biking or walking for short trips can have a big impact!"
            ]
        },
        "Energy Use": {
            positive: [
                "You're energy efficient! Keep it up and try using smart plugs to save even more.",
                "Great job! A smart thermostat could help you save additional energy.",
                "Nice work! Consider exploring solar energy for long-term benefits."
            ],
            moderate: [
                "Switching to LED bulbs and energy-efficient appliances can help.",
                "Turning off unused electronics can further reduce emissions.",
                "Consider reducing heating/cooling usage slightly."
            ],
            strong: [
                "Reducing heating/cooling use can lower emissions significantly.",
                "Switching to renewable energy sources would be a great step forward.",
                "Investing in home insulation can improve energy efficiency."
            ]
        },
        "Food and Diet": {
            positive: [
                "You're making great food choices! Try adding more seasonal produce.",
                "Awesome job! Growing your own herbs can boost sustainability.",
                "Your diet is eco-friendly—keep exploring plant-based options!"
            ],
            moderate: [
                "Reducing food waste can further improve your impact.",
                "Eating more plant-based meals can lower emissions.",
                "Buying local and seasonal food supports sustainability."
            ],
            strong: [
                "Consider cutting back on red meat to lower emissions.",
                "Reducing food waste is a great way to cut your carbon footprint.",
                "A plant-based diet has a significantly lower footprint!"
            ]
        },
        "Goods and Services": {
            positive: [
                "You're consuming responsibly! Keep it up by choosing minimal packaging.",
                "Good job! Supporting sustainable brands adds even more impact.",
                "You're reducing waste well—try tracking purchases to stay efficient."
            ],
            moderate: [
                "Buying second-hand items can further reduce emissions.",
                "Repairing instead of replacing saves money and emissions.",
                "Choosing durable products reduces waste."
            ],
            strong: [
                "Try reducing unnecessary purchases to lower your footprint.",
                "Opt for digital over physical products when possible.",
                "Choosing eco-friendly brands can make a big impact."
            ]
        },
        "Waste": {
            positive: [
                "You're handling waste efficiently! Try starting a compost bin for extra impact.",
                "Great job minimizing waste! Share your practices with others too.",
                "You're making a difference—keep reducing single-use plastics."
            ],
            moderate: [
                "Composting food waste can further reduce emissions.",
                "Reducing plastic usage can lower waste impact.",
                "Using reusable bags and bottles helps the planet."
            ],
            strong: [
                "Try recycling properly to minimize landfill waste.",
                "Reducing single-use plastics is a great step forward.",
                "Composting is an effective way to cut emissions!"
            ]
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
    
        if (!emissions || typeof emissions !== "object" || Object.keys(emissions).length === 0) {
            console.warn("⚠️ Emissions data is empty or invalid. Skipping recommendations.");
            return; // ✅ Prevents unnecessary re-renders
        }
    
        try {
            const formattedEmissions = Array.isArray(emissions) 
                ? Object.fromEntries(emissions.map(({ category, value }) => [category, value])) 
                : emissions;

            const newRecommendations = storedRecommendations.length > 0 
                ? storedRecommendations 
                : generateRecommendations(formattedEmissions).slice(0, 3);

            console.log("📌 Generated recommendations:", newRecommendations);
            setRecommendations(newRecommendations);
        } catch (err) {
            console.error("🚨 Error generating recommendations:", err);
            setError(true);
        }
    }, [JSON.stringify(emissions), JSON.stringify(storedRecommendations)]); // ✅ Prevents unnecessary re-renders
    
    

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
                    <li key={index} className="text-gray-700">{rec}</li>
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

