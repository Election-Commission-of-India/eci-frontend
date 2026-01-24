import { useState } from "react";

function DocumentUploadCard({ doc, onUpload, uploaded }) {
  const [uploadedDocs, setUploadedDocs] = useState({});
  const handleUpload = async (type, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", type);
    formData.append("documentSubType", file.type);

    //   await api.post(
    //     `/applications/${applicationId}/documents`,
    //     formData
    //   );

    setUploadedDocs((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  return (
    <div className="border rounded-md p-4 bg-white space-y-2">
      <h4 className="font-medium">
        {doc.label}
        {doc.required && <span className="text-red-500">*</span>}
      </h4>

      <input
        type="file"
        accept=".jpg,.png,.pdf"
        onChange={(e) => onUpload(doc.type, e.target.files[0])}
      />

      {uploaded && <p className="text-green-600 text-sm">Uploaded ✓</p>}
    </div>
  );
}

export default DocumentUploadCard;
