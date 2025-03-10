import React, { useState, useEffect } from "react";

const RecommendationSystem = ({ emissions }) => {
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!emissions || Object.keys(emissions).length === 0) {
            setError(true);
        } else {
            setError(false);
        }
    }, [emissions]);

    console.log("Received emissions data in RecommendationSystem:", emissions || "No emissions data received"); // ✅ Debugging

    if (error) {
        return <p className="text-red-600 font-semibold">⚠️ Oops! Unable to retrieve emissions data. Please try again.</p>;
    }

    // Reference category averages for comparison
    const categoryAverages = {
        "Transportation": { min: 5000, max: 6000, avg: 5500 },
        "Energy Use": { min: 4000, max: 5000, avg: 4500 },
        "Food and Diet": { min: 2000, max: 3000, avg: 2500 },
        "Goods and Services": { min: 2000, max: 3000, avg: 2500 },
        "Waste": { min: 500, max: 1000, avg: 750 }
    };

    // Function to categorize emissions performance
    const getCategoryFeedback = (userValue, { min, max, avg }) => {
        if (userValue < min) return "✅ Excellent! You're performing better than average!";
        if (userValue < avg) return "👍 Good job! You're on the right track.";
        if (userValue <= max) return "⚠️ You're close to average, but there's room for improvement.";
        return "❌ Your emissions are above the average. Consider making changes.";
    };

    // Function to generate recommendations based on emissions data
    const getRecommendations = (category, userValue, { min, max, avg }) => {
        const suggestions = {
            "Transportation": {
                positive: ["You're using transport efficiently! Keep it up.", "Consider continuing to use public transport or biking.", "You're making great choices! Try reducing air travel."],
                moderate: ["Carpooling a few times a week could lower your footprint.", "Consider switching to an electric or hybrid vehicle.", "Using public transport more often can help reduce emissions."],
                strong: ["Try reducing solo car trips and opt for greener alternatives.", "Switching to public transport can cut emissions significantly.", "Biking or walking for short trips can have a big impact!"]
            },
            "Energy Use": {
                positive: ["Your energy use is efficient! Keep up the great work.", "You're making a difference! Consider upgrading to even more efficient appliances.", "A smart thermostat could further optimize energy savings."],
                moderate: ["Switching to LED bulbs and energy-efficient appliances can help.", "Turning off unused electronics can further reduce emissions.", "Consider reducing heating/cooling usage slightly."],
                strong: ["Reducing heating/cooling use can lower emissions significantly.", "Switching to renewable energy sources would be a great step forward.", "Investing in home insulation can improve energy efficiency."]
            },
            "Food and Diet": {
                positive: ["You're making great food choices for the environment!", "Your diet has a low carbon footprint—keep it up!", "You're helping the planet with sustainable eating!"],
                moderate: ["Reducing food waste can further improve your impact.", "Eating more plant-based meals can lower emissions.", "Buying local and seasonal food supports sustainability."],
                strong: ["Consider cutting back on red meat to lower emissions.", "Reducing food waste is a great way to cut your carbon footprint.", "A plant-based diet has a significantly lower footprint!"]
            },
            "Goods and Services": {
                positive: ["You're doing well with responsible consumption!", "Great job prioritizing sustainable products!", "Minimal waste shopping is great for the planet!"],
                moderate: ["Buying second-hand items can further reduce emissions.", "Repairing instead of replacing saves money and emissions.", "Choosing durable products reduces waste."],
                strong: ["Try reducing unnecessary purchases to lower your footprint.", "Opt for digital over physical products when possible.", "Choosing eco-friendly brands can make a big impact."]
            },
            "Waste": {
                positive: ["You're managing waste efficiently—keep it up!", "Great job minimizing waste and recycling properly!", "Your commitment to reducing waste is impressive!"],
                moderate: ["Composting food waste can further reduce emissions.", "Reducing plastic usage can lower waste impact.", "Using reusable bags and bottles helps the planet."],
                strong: ["Try recycling properly to minimize landfill waste.", "Reducing single-use plastics is a great step forward.", "Composting is an effective way to cut emissions!"]
            }
        };

        if (userValue < min) {
            return suggestions[category].positive.slice(0, 2); // Praise + minor tips
        } else if (userValue < avg) {
            return suggestions[category].moderate.slice(0, 2); // Mild improvements
        } else {
            return suggestions[category].strong.slice(0, 3); // Stronger recommendations
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Your Carbon Footprint Report & Recommendations</h2>
            <ul className="list-disc pl-4">
                {Object.keys(emissions).map((category, index) => {
                    const feedback = getCategoryFeedback(emissions[category], categoryAverages[category]);
                    return (
                        <li key={index} className="mb-2">
                            <strong>{category}: {emissions[category]} kg CO₂e/year</strong>
                            <p className="text-blue-600">{feedback}</p>
                            <ul className="list-inside ml-4">
                                {getRecommendations(category, emissions[category], categoryAverages[category]).map((rec, i) => (
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
