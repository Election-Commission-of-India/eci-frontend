import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { documentApis } from "../services/documentApis";
import { toast } from "react-toastify";
import LoadingSmall from "../components/SmallLoading";


const FORM6_MANDATORY_DOCS = [
  {
    type: "Photo",
    label: "Passport Size Photograph",
    required: true,
    accept: "image/*",
  },
  {
    type: "AgeProof",
    label: "Age Proof (Birth Certificate / Aadhaar)",
    required: true,
    accept: ".pdf,image/*",
  },
  {
    type: "AddressProof",
    label: "Address Proof",
    required: true,
    accept: ".pdf,image/*",
  },
];

export default function UploadDocuments() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [uploadedDocs, setUploadedDocs] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [, setError] = useState(null);
  const [allSubmitted, setAllSubmitted] = useState(false);

 const applicationNumber = location.state?.applicationNumber || applicationId;
  const isNewSubmission = location.state?.isNewSubmission || false;

  useEffect(() => { 
    if (allSubmitted) {
      const handlePopState = (e) => {
        e.preventDefault();
        toast.warning("Documents already submitted. Cannot go back.");
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [allSubmitted]);

  const handleUpload = async (docType, file) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadingDoc(docType);
    setError(null);

    try {
      const response = await documentApis.uploadDocument(
        applicationId,
        file,
        docType,
        file.type
      );

      if (response.success) {
        setUploadedDocs((prev) => ({
          ...prev,
          [docType]: true,
        }));
        toast.success(`${docType} uploaded successfully!`);
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
      setUploadingDoc(null);
    }
  };

  const allMandatoryUploaded = FORM6_MANDATORY_DOCS.filter(
    (d) => d.required
  ).every((d) => uploadedDocs[d.type]);

  const handleFinalSubmit = () => {
    if (!allMandatoryUploaded) {
      toast.error("Please upload all mandatory documents");
      return;
    }

    setAllSubmitted(true);
    toast.success("All documents submitted successfully!");
    
    // Navigate to completion page with replace
    navigate(`/application/${applicationNumber}/complete`, {
      replace: true,
      state: { applicationNumber },
    });
  };


  if (allSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-medium">All documents submitted successfully!</p>
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
          Upload Supporting Documents
        </h1>
        <p className="text-sm text-gray-600">
          Application No: <span className="font-medium">{applicationNumber}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 5MB | Formats: JPG, PNG, PDF
        </p>
      </div>

     
      {isNewSubmission && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-md p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ Your application has been submitted. Please upload all required documents to complete the process.
          </p>
        </div>
      )}

   

  
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Progress: {Object.keys(uploadedDocs).length} / {FORM6_MANDATORY_DOCS.length}
          </span>
          <span className="text-xs text-gray-600">
            {allMandatoryUploaded ? "✓ All documents uploaded" : "Upload all documents to complete"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(Object.keys(uploadedDocs).length / FORM6_MANDATORY_DOCS.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

    
      {FORM6_MANDATORY_DOCS.map((doc) => (
        <div
          key={doc.type}
          className={`bg-white border rounded-md p-4 shadow-sm space-y-2 ${
            uploadedDocs[doc.type] ? "border-green-500 bg-green-50" : ""
          }`}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              {doc.label}
              {doc.required && <span className="text-red-500 ml-1">*</span>}
            </h3>

            {uploadedDocs[doc.type] && (
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

            {uploadingDoc === doc.type && <LoadingSmall size="sm" />}
          </div>

          <input
            type="file"
            accept={doc.accept}
            disabled={uploadedDocs[doc.type] || uploadingDoc === doc.type}
            onChange={(e) => {
              handleUpload(doc.type, e.target.files[0]);
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

          {uploadedDocs[doc.type] && (
            <p className="text-xs text-green-600 font-medium">
              ✓ Document uploaded successfully
            </p>
          )}
        </div>
      ))}


      <div className="flex justify-end">
        <button
          disabled={!allMandatoryUploaded}
          onClick={handleFinalSubmit}
          className={`px-6 py-2 rounded text-white font-medium transition-colors ${
            allMandatoryUploaded
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Complete Application Submission
        </button>
      </div>
    </div>
  );
}
