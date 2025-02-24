const fs = require("fs");
const path = require("path");

async function processPDF(filePath) {
  console.log("Processing PDF:", filePath);

  // 🔹 Simulate PDF processing (replace with actual processing logic)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    monthlyRating: Math.floor(Math.random() * 100),
    ratings: [
      { category: "House", value: Math.floor(Math.random() * 20) - 10 },
      { category: "Car", value: Math.floor(Math.random() * 20) - 10 },
      { category: "Public Transport", value: Math.floor(Math.random() * 20) - 10 },
      { category: "Food", value: Math.floor(Math.random() * 20) - 10 },
      { category: "Retail", value: Math.floor(Math.random() * 20) - 10 },
    ],
    sustainabilityGoals: [
      { text: "Try Carpooling", completed: Math.random() > 0.5 },
      { text: "Reduce meat intake", completed: Math.random() > 0.5 },
      { text: "Choose eco-friendly brands", completed: Math.random() > 0.5 },
    ],
  };
}

module.exports = { processPDF };
