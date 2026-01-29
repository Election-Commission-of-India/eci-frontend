import React from "react";
import { useNavigate } from "react-router-dom";

const ApplicationSuccessModal = ({ isOpen, onClose, applicationNumber }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Submitted Successfully!
        </h2>

        {/* Application Number */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-600 text-center mb-1">Application Number</p>
          <p className="text-xl font-bold text-green-700 text-center tracking-wide">
            {applicationNumber}
          </p>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm mb-6">
          Your application has been submitted. You'll receive updates via SMS and email.
        </p>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onClose();
              navigate("/track/status");
            }}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium transition"
          >
            Track Status
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/");
            }}
            className="w-full border-2 border-gray-300 py-3 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessModal;
