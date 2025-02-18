import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"; // Placeholder Download Icon
import UploadModal from "../components/UploadModal"; // Upload Modal
import { useResults } from "../context/ResultsContext";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { results } = useResults();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reports`)
      .then((response) => response.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        console.error("Error fetching reports");
        setReports([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Reports:</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-500">No reports available yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4 overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Report Date</th>
                <th className="border border-gray-300 px-4 py-2">Upload Type</th>
                <th className="border border-gray-300 px-4 py-2">Report</th>
                <th className="border border-gray-300 px-4 py-2">File Download</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{report.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.type}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link to={`/results/${report.id}`} className="text-blue-600 hover:underline">
                      {report.name}
                    </Link>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center">
                    <button className="text-gray-500 hover:text-gray-900">
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Bottom Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <button className="btn btn-primary" onClick={() => setIsUploadOpen(true)}>
          Upload New PDF
        </button>
        <Link to="/calculator" className="btn btn-primary">
          Manual Calculator
        </Link>
        <Link to="/dashboard" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>

      {/* ✅ Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}
