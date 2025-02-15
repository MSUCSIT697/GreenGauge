console.log("Backend started! Waiting for requests...");

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock API Route for Dashboard Data
app.get("/api/dashboard-data", (req, res) => {
  
  console.log("API received a request at /api/dashboard-data");
  res.json({
    monthlyRating: 72,
    ratings: [
      { category: "House", value: -11 },
      { category: "Car", value: 9 },
      { category: "Public Transport", value: -20 },
      { category: "Food", value: 7 },
      { category: "Retail", value: 12 },
    ],
    sustainabilityGoals: [
      { text: "Try Carpooling or switching to a more fuel-efficient route", completed: true },
      { text: "Try Reducing meat intake and opting for local produce", completed: false },
      { text: "Try to reduce non-essential purchases or choose eco-friendly brands", completed: false },
    ],
  });
});

app.get("/api/progress-data", (req, res) => {
  console.log("Progress API hit!"); // ✅ Log when the API is accessed
  res.json([
    { month: "Month 1", value: 80 },
    { month: "Month 2", value: 70 },
    { month: "Month 3", value: 65 },
    { month: "Month 4", value: 60 },
    { month: "Month 5", value: 55 },
  ]);
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
