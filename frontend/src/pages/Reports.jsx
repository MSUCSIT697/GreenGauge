import { useState } from "react";
import { useResults } from "../context/ResultsContext";
import { Link } from "react-router-dom";
import RecommendationSystem from "../components/Recommendations"; // ✅ Ensure correct path


export default function Reports() {
  const { results } = useResults();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Reports :</h1>
      <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Report Date</th>
            <th className="border border-gray-300 px-4 py-2">Upload Type / File Name</th>
            <th className="border border-gray-300 px-4 py-2">View Report</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-gray-500 p-4">No reports available yet.</td>
            </tr>
          ) : (
            results.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {report.create_ts ? new Date(report.create_ts).toLocaleDateString() : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {report.source === "upload" ? "File Upload" : report.source === "manual" ? "Manual Calculation" : "Unknown"}
                </td>

                <td className="border border-gray-300 px-4 py-2">
                <Link 
                  to={{
                    pathname: "/results",
                    state: { report } // ✅ Ensure report data is passed properly
                  }} 
                  className="text-blue-600 hover:underline">
                  View Results
                </Link>

                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}
