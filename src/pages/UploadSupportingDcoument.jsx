import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { documentApis } from "../services/documentApis";
import { toast } from "react-toastify";
import LoadingSmall from "../components/SmallLoading";


export default function UploadSupportingDocuments() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const applicationNumber = location.state?.applicationNumber || applicationId;
  const isNewSubmission = location.state?.isNewSubmission || false;

  const [uploadedDoc, setUploadedDoc] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [, setError] = useState(null);
  const [allSubmitted, setAllSubmitted] = useState(false);

  // Prevent back navigation after submission
  useEffect(() => {
    if (allSubmitted) {
      const handlePopState = (e) => {
        e.preventDefault();
        toast.warning("Document already submitted. Cannot go back.");
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [allSubmitted]);

  const handleUpload = async (file) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await documentApis.uploadDocument(
        applicationId,
        file,
        "CorrectionProof", // Document type for Form 8
        file.type
      );

      if (response.success) {
        setUploadedDoc(true);
        toast.success("Supporting document uploaded successfully!");
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload document";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleFinalSubmit = () => {
    if (!uploadedDoc) {
      toast.error("Please upload supporting document");
      return;
    }

    setAllSubmitted(true);
    toast.success("Correction request completed successfully!");

    navigate(`/application/${applicationId}/complete`, {
      replace: true,
      state: { applicationId, applicationNumber },
    });
  };

  if (allSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-medium">Document submitted successfully!</p>
          <p className="text-sm mt-1">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          Upload Supporting Document
        </h1>
        <p className="text-sm text-gray-600">
          Application No: <span className="font-medium">{applicationNumber}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 5MB | Formats: JPG, PNG, PDF
        </p>
      </div>

      {/* Warning */}
      {isNewSubmission && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-md p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ Your correction request has been submitted. Please upload supporting document to complete the process.
          </p>
        </div>
      )}

     

      {/* Progress */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Progress: {uploadedDoc ? "1" : "0"} / 1
          </span>
          <span className="text-xs text-gray-600">
            {uploadedDoc ? "✓ Document uploaded" : "Upload document to complete"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: uploadedDoc ? "100%" : "0%" }}
          ></div>
        </div>
      </div>

      {/* Upload Section */}
      <div
        className={`bg-white border rounded-md p-4 shadow-sm space-y-2 ${
          uploadedDoc ? "border-green-500 bg-green-50" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium">
            Supporting Document for Correction
            <span className="text-red-500 ml-1">*</span>
          </h3>

          {uploadedDoc && (
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Uploaded
            </span>
          )}

          {uploading && <LoadingSmall size="sm" />}
        </div>

        <p className="text-sm text-gray-600">
          Upload proof document that supports your correction request (e.g., Aadhaar, Passport, Birth Certificate)
        </p>

        <input
          type="file"
          accept=".pdf,image/*"
          disabled={uploadedDoc || uploading}
          onChange={(e) => {
            handleUpload(e.target.files[0]);
            e.target.value = null;
          }}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {uploadedDoc && (
          <p className="text-xs text-green-600 font-medium">
            ✓ Document uploaded successfully
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Acceptable Documents</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Aadhaar Card</li>
          <li>• Passport</li>
          <li>• Birth Certificate (for DOB correction)</li>
          <li>• Address Proof (for Address correction)</li>
          <li>• Any government-issued document</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate(-1)}
          disabled={uploading || uploadedDoc}
          className="border px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>

        <button
          disabled={!uploadedDoc || uploading}
          onClick={handleFinalSubmit}
          className={`px-6 py-2 rounded text-white font-medium transition-colors ${
            uploadedDoc
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Complete Submission
        </button>
      </div>
    </div>
  );
}
