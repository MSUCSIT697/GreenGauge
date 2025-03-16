import React, { useState, useEffect } from "react";

const RecommendationSystem = ({ emissions, storedRecommendations = [] }) => {
    const [error, setError] = useState(false);
    const [recommendations, setRecommendations] = useState(storedRecommendations);

    useEffect(() => {
        if (!emissions || typeof emissions !== "object" || Object.keys(emissions).length === 0) {
            setError(true);
            return;
        }

        if (!storedRecommendations.length) {
            setRecommendations(generateRecommendations(emissions));
        }
    }, [emissions, storedRecommendations]);

    if (error) {
        return <p className="text-red-600 font-semibold">⚠️ Oops! Unable to retrieve emissions data. Please try again.</p>;
    }

    // ✅ Reference category averages for comparison
    const categoryAverages = {
        "Transportation": { min: 5000, max: 6000, avg: 5500 },
        "Energy Use": { min: 4000, max: 5000, avg: 4500 },
        "Food and Diet": { min: 2000, max: 3000, avg: 2500 },
        "Goods and Services": { min: 2000, max: 3000, avg: 2500 },
        "Waste": { min: 500, max: 1000, avg: 750 }
    };

    // ✅ Categorize emissions performance
    const getCategoryFeedback = (userValue, { min, avg, max }) => {
        if (userValue < min) return "✅ Excellent! You're performing better than average!";
        if (userValue < avg) return "👍 Good job! You're on the right track.";
        if (userValue <= max) return "⚠️ You're close to average, but there's room for improvement.";
        return "❌ Your emissions are above the average. Consider making changes.";
    };

    // ✅ Function to generate recommendations
    const generateRecommendations = (emissionsData) => {
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

        return Object.keys(emissionsData).map((category) => {
            const userValue = emissionsData[category];
            const avgData = categoryAverages[category];

            if (!avgData) return null;

            if (userValue < avgData.min) return suggestions[category].positive.slice(0, 2);
            if (userValue < avgData.avg) return suggestions[category].moderate.slice(0, 2);
            return suggestions[category].strong.slice(0, 3);
        }).flat();
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Carbon Footprint Report & Recommendations</h2>
            <ul className="list-disc pl-4">
                {Object.entries(emissions).map(([category, value], index) => {
                    const feedback = getCategoryFeedback(value, categoryAverages[category]);
                    return (
                        <li key={index} className="mb-2">
                            <strong>{category}: {value} kg CO₂e/year</strong>
                            <p className="text-blue-600">{feedback}</p>
                            <ul className="list-inside ml-4">
                                {recommendations[index]?.map((rec, i) => (
                                    <li key={i} className="text-gray-700">- {rec}</li>
                                ))}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RecommendationSystem;
