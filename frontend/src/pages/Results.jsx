import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Added `useParams`
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import GaugeChart from "../components/GaugeChart";
import RecommendationSystem from "../components/Recommendations";
import { useResults } from "../context/ResultsContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale,  PointElement,  LineElement,  Filler, } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Radar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement);
ChartJS.register(  RadialLinearScale,  PointElement,  LineElement,  Filler  );



ChartJS.register(ArcElement, Tooltip, Legend);

export default function Results() {
  
  const [viewType, setViewType] = useState("pie");
  const { results, updateResults } = useResults();
  const { reportId } = useParams(); // ✅ Get the report ID from the URL
  const navigate = useNavigate();

  const [userResults, setUserResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Hardcoded U.S. Average Midpoint for Gauge
  const USA_AVG_MIDPOINT = 1225; 
  const USA_AVG_CATEGORY = {
    "Transportation": 458,
    "Electricity": 375,
    "Waste": 62,
    "Food": 209,
    "Retail": 209
  };

  // ✅ NEW: Find the specific report the user clicked on
  useEffect(() => {
    if (!reportId) {
      setError("Invalid report ID.");
      setLoading(false);
      return;
    }

    console.log(`🔍 Looking for report with ID: ${reportId}`);

    // ✅ Find the report matching the `reportId`
    const matchingReport = results.find(report => report.create_ts === reportId);

    if (matchingReport) {
      console.log("✅ Found matching report:", matchingReport);
      setUserResults(matchingReport);
    } else {
      setError("No report found for this ID.");
    }

    setLoading(false);
  }, [reportId, results]);

  // ✅ Check local storage for past results if needed
  useEffect(() => {
    if (userResults) return; // ✅ Skip if already found in context

    console.log("🔍 Checking local storage for past results.");
    const storedResults = localStorage.getItem("userResults");

    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      const matchingStoredReport = parsedResults.find(report => report.create_ts === reportId);
      
      if (matchingStoredReport) {
        console.log("✅ Loaded results from local storage:", matchingStoredReport);
        setUserResults(matchingStoredReport);
        setLoading(false);
        return;
      }
    }

    // If no stored results, fetch from API
    useEffect(() => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.warn("⚠️ No authentication token found.");
        setError("Session expired. Please log in.");
        navigate("/sign-in");
        return;
      }
    
      const fetchResults = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/get_user_results`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
    
          if (!response.ok) {
            if (response.status === 401) {
              console.warn("⚠️ Unauthorized! Redirecting to login...");
              navigate("/sign-in");
            }
            throw new Error(`API request failed with status ${response.status}`);
          }
    
          const data = await response.json();
          console.log("✅ Retrieved user results:", data);
          if (data.results) setUserResults(data.results.find(r => r.create_ts === reportId) || null);
        } catch (err) {
          console.error("🚨 Error fetching user results:", err);
          setError("Failed to fetch results.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchResults();
    }, [navigate, reportId]);
    

    const fetchResults = async () => {
      try {
        console.log("Fetching user results...");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/get_user_results`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Received results from API:", data);

        if (data.error) {
          setError(data.error);
          return;
        }

        const matchingApiReport = data.results.find(report => report.create_ts === reportId);

        if (matchingApiReport) {
          setUserResults(matchingApiReport);
          updateResults(matchingApiReport);
        } else {
          setError("No matching report found.");
        }

      } catch (err) {
        console.error("🚨 Error fetching user results:", err);
        setError("Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userResults, reportId, results, navigate, updateResults]);

  // ✅ Properly Format Emissions Data
  const formattedEmissions = userResults?.emissions
    ? Array.isArray(userResults.emissions)
      ? Object.fromEntries(userResults.emissions.map(({ category, value }) => [category, value]))
      : { ...userResults.emissions }
    : {};

  console.log("✅ Processed Emissions for Recommendations:", formattedEmissions);

  // ✅ Pie Chart Data
  const pieData = {
    labels: ["Food", "Retail", "Transportation", "Electricity", "Waste"],
    datasets: [
      {
        data: Object.values(formattedEmissions), 
        backgroundColor: ["#10b981", "#108981", "#fecaca", "#316bd6", "#f09e41"],
      },
    ],
  };
  const chartColors = ["#10b981", "#108981", "#fecaca", "#316bd6", "#f09e41"];
const usAvgColor = "#9ca3af"; // gray for US average

const barData = {
  labels: Object.keys(USA_AVG_CATEGORY),
  datasets: [
    {
      label: "Your Emissions",
      data: Object.keys(USA_AVG_CATEGORY).map(cat => {
        const userVal = userResults?.emissions?.find(e => e.category === cat)?.value || 0;
        return parseFloat(userVal.toFixed(3));
      }),
      backgroundColor: chartColors, // TODO :: should be consistent for all categories
    },
    {
      label: "US Average Emissions",
      data: Object.values(USA_AVG_CATEGORY),
      backgroundColor: "#f09e41",
    },
  ],
};

const radarData = {
  labels: Object.keys(USA_AVG_CATEGORY),
  datasets: [
    {
      label: 'Your Emissions',
      data: Object.keys(USA_AVG_CATEGORY).map((cat) =>
        userResults?.emissions?.find((e) => e.category === cat)?.value || 0
      ),
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: '#10b981',
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#10b981',
    },
    {
      label: 'US Average Emissions',
      data: Object.values(USA_AVG_CATEGORY),
      backgroundColor: 'rgba(240, 158, 65, 0.2)',
      borderColor: '#f09e41',
      pointBackgroundColor: '#f09e41',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#f09e41',
    },
  ],
};

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Emissions Comparison' },
  },
  scales: {
    r: {
      beginAtZero: true,
      angleLines: { display: true },
      ticks: { display: true },
    },
  },
};


const listedComparison = Object.keys(USA_AVG_CATEGORY).map((category, i) => {
  const userVal = userResults?.emissions?.find(e => e.category === category)?.value?.toFixed(3) || 0;
  const avgVal = USA_AVG_CATEGORY[category];
    
  return (
    <div key={i} className="contents gap-x-4 py-4">
      <div className="text-left font-medium text-gray-700">{category}</div>
      <div className="text-left text-gray-900">{userVal} kg CO₂</div>
      <div className="text-left text-gray-500"> {avgVal} kg CO₂</div>
    </div>
  );
});



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">Results Overview:</h1>

      {/* ✅ Error Handling */}
      {error && <p className="text-red-600 text-center mt-5">{error}</p>}

      {/* ✅ Show Loading While Fetching */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : userResults ? (
        <>
          {/* ✅ Gauge Comparison (User vs. US Avg) */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Gauge Comparison</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="flex flex-col items-center">
                <GaugeChart id="userGauge" rating={userResults?.total_emissions || 0} />
                <p className="mt-2 font-semibold text-gray-900">Your Carbon Footprint</p>
              </div>
              <div className="flex flex-col items-center">
                <GaugeChart id="usGauge" rating={USA_AVG_MIDPOINT} />
                <p className="mt-2 font-semibold text-gray-900">US Average Footprint</p>
              </div>
            </div>
          </div>

          

          {/* ✅ Updated Category Comparison with Toggle View */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold text-gray-900 mb-2">Category Comparison: You vs. US Average</h2>
            <div className="pt-2 pb-4">
              {/* Toggle Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['bar', 'pie', 'radar', 'list'].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-1 rounded-md text-sm ${
                      viewType === type ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => setViewType(type)}
                  >
                    {type === 'pie'
                      ? 'Pie Chart'
                      : type === 'bar'
                      ? 'Bar Graph'
                      : type === 'list'
                      ? 'List View'
                      : 'Radar Chart'}
                  </button>
                ))}
              </div>

              {/* View Area */}
              {viewType === "pie" && (
                <div className="flex flex-col md:flex-row justify-evenly items-center flex-wrap w-full px-4 sm:px-8 md:px-12 lg:px-20 gap-6 md:gap-12">


                  <div style={{ width: "300px" }}>
                    <Pie
                      data={{
                        labels: Object.keys(formattedEmissions),
                        datasets: [{ data: Object.values(formattedEmissions), backgroundColor: chartColors }],
                      }}
                    />
                    <p className="text-center mt-2 text-md font-medium text-gray-700">Your Emissions</p>
                  </div>
                  <div style={{ width: "300px" }}>
                    <Pie
                      data={{
                        labels: Object.keys(USA_AVG_CATEGORY),
                        datasets: [{ data: Object.values(USA_AVG_CATEGORY), backgroundColor: chartColors }],
                      }}
                    />
                    <p className="text-center mt-2 text-md font-medium text-gray-700">US Average Emissions</p>
                  </div>
                </div>
              )}

              {viewType === "bar" && (
                <div className="mt-4 w-full" style={{ maxHeight: "600px", overflowY: "auto" }}>
                  <div className="relative" style={{ minHeight: "300px", maxHeight: "600px" }}>
                    <Bar
                      data={barData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: "top" } },
                        scales: { y: { beginAtZero: true } },
                      }}
                    />
                  </div>
                </div>
              )}


              {viewType === 'radar' && (
                <div className="mt-4" style={{ height: '400px' }}>
                  <Radar data={radarData} options={radarOptions} />
                </div>
              )}


              {viewType === "list" && (
                <div className="flex flex-col items-center w-full">
                  <div className="grid grid-cols-3 gap-x-4 sm:gap-x-8 md:gap-x-12 lg:gap-x-20 xl:gap-x-32 text-base mt-4 w-full max-w-6xl px-4 sm:px-6 lg:px-8">

                    {/* Column Headers */}
                    <div className="text-left font-semibold border-b pb-1">Category</div>
                    <div className="text-left font-semibold border-b pb-1">Your Emissions</div>
                    <div className="text-left font-semibold border-b pb-1">US Average Emissions</div>

                    {/* Listed Data */}
                    {listedComparison}
                  </div>
                </div>
              )}




            </div>
          </div>



          {/* ✅ Personalized Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="font-semibold">Personalized Recommendations</h2>
            <RecommendationSystem 
                emissions={formattedEmissions} 
                storedRecommendations={Array.isArray(userResults?.recommendations) ? userResults.recommendations : []} 
            />
          </div>
                    
          {/* ✅ Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <Link to="/reports" className="btn btn-primary">View Reports</Link>
            <Link to="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
          </div>
        </>
      ) : (
        <p className="text-red-600 text-center mt-5">No valid results found. Please try again.</p>
      )}
    </div>
  );
}
