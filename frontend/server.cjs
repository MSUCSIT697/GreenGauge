const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5000;
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

let reports = []; // ✅ Store all past reports
let latestResults = null; // ✅ Store the most recent results

// ✅ Get Latest Results
app.get("/api/latest-results", (req, res) => {
  if (!latestResults) {
    return res.json({
      id: null,
      monthlyRating: 0,
      ratings: [],
      sustainabilityGoals: [],
    });
  }
  res.json(latestResults);
});

// ✅ Get Specific Report by ID
app.get("/api/reports/:id", (req, res) => {
  const report = reports.find((r) => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: "Report not found" });
  res.json(report);
});

// ✅ Get All Reports (For Reports Page)
app.get("/api/reports", (req, res) => {
  res.json(reports);
});

// ✅ Upload PDF & Process Results
app.post("/upload-pdf", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("PDF Uploaded:", req.file.originalname);

  const newResult = {
    id: `report_${Date.now()}`,
    date: new Date().toLocaleDateString(),
    type: "PDF",
    monthlyRating: 75, // Example data
    ratings: [
      { category: "House", value: -5 },
      { category: "Car", value: 8 },
    ],
    sustainabilityGoals: [{ text: "Try carpooling", completed: false }],
  };

  latestResults = newResult; // ✅ Update latest result
  reports.push(newResult); // ✅ Save the report for future access

  res.json({ message: "Success", latestResults });
});

// ✅ Manual Calculator Entry
app.post("/manual-calculator", (req, res) => {
  console.log("Manual Calculator Submission:", req.body);

  const newResult = {
    id: `report_${Date.now()}`,
    date: new Date().toLocaleDateString(),
    type: "Manual",
    monthlyRating: req.body.monthlyRating || 50,
    ratings: req.body.ratings || [],
    sustainabilityGoals: req.body.sustainabilityGoals || [],
  };

  latestResults = newResult; // ✅ Update latest result
  reports.push(newResult); // ✅ Save the report

  res.json({ message: "Success", latestResults });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
