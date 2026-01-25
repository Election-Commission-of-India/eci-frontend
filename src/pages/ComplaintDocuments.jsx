import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormSectionCard from "../components/form6/FormSectionCard";

function ComplaintDocuments() {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    console.log("Uploading files for complaint:", complaintId);

    // TODO: POST /api/complaints/{complaintId}/attachments

    navigate("/complaints/acknowledgement");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        Upload Supporting Documents
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        Upload any documents or images that support your complaint (optional).
      </p>

      <FormSectionCard title="Attachments">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="input"
        />
        <p className="text-xs text-gray-500 mt-2">
          Allowed formats: JPG, PNG, PDF (Max 5 files)
        </p>
      </FormSectionCard>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg text-gray-700"
        >
          Back
        </button>

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Upload & Continue
        </button>
      </div>
    </div>
  );
}

export default ComplaintDocuments;
