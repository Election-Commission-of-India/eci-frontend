import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
// import api from "../services/api"; // your axios instance

export default function UploadSupportingDocuments() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [uploadedDocs, setUploadedDocs] = useState({});
  const [loading, setLoading] = useState(false);

  const handleUpload = async (docType, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", docType);
    formData.append("documentSubType", file.type);

    try {
      setLoading(true);
      //   await api.post(`/applications/${applicationId}/documents`, formData);

      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: true,
      }));
    } catch (err) {
      alert("Failed to upload document" + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-md p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          Upload Documents
        </h1>
        <p className="text-sm text-gray-600">
          Application No: <span className="font-medium">{applicationId}</span>
        </p>
      </div>

      <div className="bg-white border rounded-md p-4 shadow-sm space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">
            Upload Supporting doc
            {<span className="text-red-500 ml-1">*</span>}
          </h3>

          {/* { && (
              <span className="text-green-600 text-sm">Uploaded ✓</span>
            )} */}
        </div>

        <input
          type="file"

          // disabled={uploadedDocs[doc.type]}
          // onChange={(e) => handleUpload(doc.type, e.target.files[0])}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate(-1)}
          className="border px-4 py-2 rounded"
        >
          Back
        </button>

        <button
          disabled={loading}
          onClick={() => navigate("/success")}
          className={`px-6 py-2 rounded text-white ${
            true
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit Documents
        </button>
      </div>
    </div>
  );
}
