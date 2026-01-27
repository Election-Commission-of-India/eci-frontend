import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export default function ComplaintSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const complaintId = location.state?.complaintId;
  const complaintNumber = location.state?.complaintNumber;

  // Prevent back navigation
  useEffect(() => {
    const handlePopState = () => {
      navigate("/complaints/success", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Complaint Registered Successfully!
          </h1>

          {/* Complaint Number */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Your Complaint Number</p>
            <p className="text-2xl font-bold text-blue-600">{complaintNumber}</p>
            <p className="text-xs text-gray-500 mt-1">
              Please save this for future reference
            </p>
          </div>

          {/* Success Message */}
          <p className="text-gray-600 mb-6">
            Your complaint has been successfully registered and will be reviewed by our team.
          </p>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-800 mb-3">📋 What Happens Next?</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Your complaint will be reviewed by the authorities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>A BLO will be assigned to investigate the issue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>You will receive SMS and email updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Resolution will be provided within 7-14 working days</span>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="border-t pt-6 text-center text-sm text-gray-600">
            <p className="font-semibold mb-2">Need Help?</p>
            <p>Call <strong>1950</strong> or email <strong>support@eci.gov.in</strong></p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("/track")}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Track Status
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
