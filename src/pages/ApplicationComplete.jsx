import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";

export default function ApplicationComplete() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
//   const location = useLocation();

  // Prevent back navigation
  useEffect(() => {
    const handlePopState = () => {
      navigate(`/application/${applicationId}/complete`, { replace: true });
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applicationId, navigate]);

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
            Application Submitted Successfully!
          </h1>

          {/* Application Number */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Your Application Number</p>
            <p className="text-2xl font-bold text-blue-600">{applicationId}</p>
            <p className="text-xs text-gray-500 mt-1">Please save this for future reference</p>
          </div>

          {/* Success Message */}
          <p className="text-gray-600 mb-6">
            Your voter registration application (Form 6) and all supporting documents
            have been successfully submitted.
          </p>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-800 mb-3">📋 What Happens Next?</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Your application will be verified by the Booth Level Officer (BLO)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>You will receive SMS and email updates on your application status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Processing typically takes 7-15 working days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Once approved, your name will be added to the electoral roll</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/track/status`)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Track Application Status
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="border-2 border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              Go to Home
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 mt-6">
            💡 You can track your application status anytime using your application number
          </p>
        </div>
      </div>
    </div>
  );
}
