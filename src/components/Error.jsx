import { useNavigate } from "react-router-dom";

export default function ErrorPage({
  title = "Oops! Something went wrong",
  message = "We couldn't load this page. Please try again.",
  showHomeButton = true,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md p-8">
        {/* Error Icon */}
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">{title}</h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>

          {showHomeButton && (
            <button
              onClick={() => navigate("/")}
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100"
            >
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
