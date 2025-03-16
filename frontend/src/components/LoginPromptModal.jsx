import { useNavigate } from "react-router-dom";

export default function LoginPromptModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold text-gray-900">Please Sign In</h2>
        <p className="text-gray-700 mt-2">
          To access your dashboard and track your emissions, please sign in.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
