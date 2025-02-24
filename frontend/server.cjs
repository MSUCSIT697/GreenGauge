const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios"); // ✅ Used to send requests to the emissions API
const { processPDF } = require("./processModel");

const app = express();
const PORT = 5000;
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

let latestResults = null;
let reports = [];

// ✅ Fetch Latest Results
app.get("/api/latest-results", (req, res) => {
  res.json(latestResults || { total_emissions: 0, breakdown: {}, source: "None" });
});

// ✅ Fetch Reports
app.get("/api/reports", (req, res) => {
  res.json(reports);
});

// ✅ Function to Call Emissions API
async function calculateEmissions(data) {
  try {
    const response = await axios.post("https://api.example.com/calculate_emissions", data);
    return response.data; // The emissions breakdown from the API
  } catch (error) {
    console.error("Error calling emissions API:", error);
    return null;
  }
}

// ✅ Process PDF Upload and Calculate Emissions
app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("PDF Uploaded:", req.file.originalname);

  try {
    const extractedData = await processPDF(req.file.path); // Extract structured data from the PDF
    
    const emissionsData = await calculateEmissions(extractedData);
    if (!emissionsData) {
      return res.status(500).json({ error: "Failed to calculate emissions" });
    }

    latestResults = {
      ...emissionsData,
      source: "PDF",
    };

    const newReport = {
      id: `report_${Date.now()}`,
      date: new Date().toLocaleDateString(),
      type: "PDF",
      name: `Report_${Date.now()}`,
    };

    reports.push(newReport);

    res.json({ message: "Success", latestResults });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
});

// ✅ Manual Calculator Submission
app.post("/manual-calculator", async (req, res) => {
  console.log("Manual Calculator Submission:", req.body);

  const emissionsData = await calculateEmissions(req.body);
  if (!emissionsData) {
    return res.status(500).json({ error: "Failed to calculate emissions" });
  }

  latestResults = {
    ...emissionsData,
    source: "Manual",
  };

  const newReport = {
    id: `report_${Date.now()}`,
    date: new Date().toLocaleDateString(),
    type: "Manual",
    name: `Report_${Date.now()}`,
  };

  reports.push(newReport);

  res.json({ message: "Success", latestResults });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
