import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
// import api from "../services/api"; // your axios instance

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

  const allMandatoryUploaded = FORM6_MANDATORY_DOCS.filter(
    (d) => d.required,
  ).every((d) => uploadedDocs[d.type]);

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

      {/* Documents */}
      {FORM6_MANDATORY_DOCS.map((doc) => (
        <div
          key={doc.type}
          className="bg-white border rounded-md p-4 shadow-sm space-y-2"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              {doc.label}
              {doc.required && <span className="text-red-500 ml-1">*</span>}
            </h3>

            {uploadedDocs[doc.type] && (
              <span className="text-green-600 text-sm">Uploaded ✓</span>
            )}
          </div>

          <input
            type="file"
            accept={doc.accept}
            disabled={uploadedDocs[doc.type]}
            onChange={(e) => handleUpload(doc.type, e.target.files[0])}
          />
        </div>
      ))}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate(-1)}
          className="border px-4 py-2 rounded"
        >
          Back
        </button>

        <button
          disabled={!allMandatoryUploaded || loading}
          onClick={() => navigate("/success")}
          className={`px-6 py-2 rounded text-white ${
            allMandatoryUploaded
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
