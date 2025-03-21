import { useResults } from "../context/ResultsContext";
import { Link } from "react-router-dom";

export default function Reports() {
  const { results } = useResults();

  // ✅ Sort reports by date (newest first)
  const sortedResults = [...results].sort((a, b) => new Date(b.create_ts) - new Date(a.create_ts));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Reports :</h1>
      <table className="table-auto w-full border-collapse border border-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Report Date</th>
            <th className="border border-gray-300 px-4 py-2">Upload Type</th>
            <th className="border border-gray-300 px-4 py-2">View Report</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-gray-500 p-4">No reports available yet.</td>
            </tr>
          ) : (
            sortedResults.map((report) => (
              <tr key={report.create_ts || Math.random()} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {report.create_ts ? new Date(report.create_ts).toLocaleDateString() : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {report.source === "upload" ? "File Upload" : "Manual Calculation"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    to={`/results/${report.create_ts}`} // ✅ Pass unique ID in URL
                    className="text-blue-600 hover:underline"
                  >
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
