import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { complaintDocumentApis } from "../services/complaintDocumentApis";
import { toast } from "react-toastify";
import LoadingSmall from "../components/SmallLoading";
import ApplicationSuccessModal from "./ApplicationComplete";
import CommplaintSuccessModal from "./ComplaintSuccess";

export default function UploadComplaintDocuments() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const complaintNumber = location.state?.complaintNumber || `CMP-${complaintId}`;
  const isNewSubmission = location.state?.isNewSubmission || false;

  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [allSubmitted, setAllSubmitted] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [applicationNumberState, setApplicationNumber] = useState("");
    const [loading, setLoading] = useState(false);

  // Fetch existing documents on mount
  useEffect(() => {
    const fetchExistingDocuments = async () => {
      setLoadingExisting(true);
      try {
        const response = await complaintDocumentApis.getDocuments(complaintId);
        if (response.success && response.data) {
          
          setUploadedDocs(response.data);
        }
      } catch (error) {
        // No documents yet, that's fine
        console.log("No existing documents" + error);
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchExistingDocuments();
  }, [complaintId]);

  // Prevent back navigation after submission
  useEffect(() => {
    if (allSubmitted) {
      const handlePopState = (e) => {
        e.preventDefault();
        toast.warning("Complaint already submitted. Cannot go back.");
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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and PDF files are allowed");
      return;
    }

    setUploading(true);

    try {
      const response = await complaintDocumentApis.uploadDocument(complaintId, file);

      console.log("Upload Response:", response);

      if (response.success) {
        // Refresh document list
        const docsResponse = await complaintDocumentApis.getDocuments(complaintId);
        if (docsResponse.success) {
          setUploadedDocs(docsResponse.data);
        }
        
        toast.success("Document uploaded successfully!");
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to upload document";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await complaintDocumentApis.downloadDocument(complaintId, documentId);
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Document downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download document"  + error);
    }
  };

  const handleSkipOrComplete = () => {
  setShowSuccessModal(true);
  setApplicationNumber(complaintNumber)

    toast.success("Complaint registered successfully!");

    // navigate(`/complaints/success`, {
    //   replace: true,
    //   state: { complaintId, complaintNumber },
    // });
  };

  // if (allSubmitted) {
  //   return (
  //     <div className="max-w-4xl mx-auto p-4">
  //       <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
  //         <p className="font-medium">Complaint registered successfully!</p>
  //         <p className="text-sm mt-1">Redirecting...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          📎 Upload Supporting Documents (Optional)
        </h1>
        <p className="text-sm text-gray-600">
          Complaint No: <span className="font-medium">{complaintNumber}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum file size: 5MB | Formats: JPG, PNG, PDF
        </p>
      </div>

      {/* Success Message */}
      {isNewSubmission && (
        <div className="bg-green-50 border border-green-300 rounded-md p-3">
          <p className="text-sm text-green-800">
            ✅ Your complaint has been registered successfully! You can upload supporting documents or skip this step.
          </p>
        </div>
      )}

      {/* Progress */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Uploaded Documents: {uploadedDocs.length}
          </span>
          <span className="text-xs text-gray-600">
            Upload evidence to support your complaint
          </span>
        </div>
        {uploadedDocs.length > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300 w-full"></div>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-white border rounded-md p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800">
            Upload Evidence Documents
          </h3>

          {uploading && <LoadingSmall size="sm" />}
        </div>

        <p className="text-sm text-gray-600">
          Upload photos, screenshots, or documents that support your complaint
        </p>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={uploading}
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
      </div>

      {/* Uploaded Documents List */}
      {loadingExisting ? (
        <div className="bg-white border rounded-md p-4 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <LoadingSmall size="sm" />
            <p className="text-sm text-gray-600">Loading documents...</p>
          </div>
        </div>
      ) : uploadedDocs.length > 0 && (
        <div className="bg-white border rounded-md p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">📄 Uploaded Documents</h3>
          <div className="space-y-2">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.attachmentId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded border"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(doc.fileSize / 1024).toFixed(2)} KB • Uploaded by {doc.uploadedByName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(doc.attachmentId, doc.fileName)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <span>ℹ️</span> Acceptable Documents
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Photos of issues at polling station</li>
          <li>• Screenshots of online errors</li>
          <li>• Copies of relevant documents (Aadhaar, EPIC, etc.)</li>
          <li>• Any evidence supporting your complaint</li>
          <li>• Maximum 5MB per file</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate(-1)}
          disabled={uploading}
          className="border px-6 py-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back
        </button>

        <button
          onClick={handleSkipOrComplete}
          disabled={uploading}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
        >
          {uploadedDocs.length > 0 ? "Complete Submission" : "Skip & Complete"}
        </button>
      </div>

      <CommplaintSuccessModal isOpen={showSuccessModal} applicationNumber={applicationNumberState} onClose={()=> setShowSuccessModal(false)}/>
    </div>
  );
}
