import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"; 
import UploadModal from "../components/UploadModal"; 
import { useResults } from "../context/ResultsContext";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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
      <h1 className="text-2xl font-bold text-gray-900">My Reports :</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading reports...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Report Date</th>
              <th className="border border-gray-300 px-4 py-2">Upload Type</th>
              <th className="border border-gray-300 px-4 py-2">Report</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 p-4">
                  No reports available yet.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{report.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.type}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link to={`/results/${report.id}`} className="text-blue-600 hover:underline">
                      View Results
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
