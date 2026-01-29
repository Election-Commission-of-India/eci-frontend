import axios from "axios";

const BASE_URL = "http://localhost:8080/api/complaints";

export const complaintDocumentApis = {
  // Upload single document
  uploadDocument: async (complaintId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${BASE_URL}/${complaintId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  // Get all documents for a complaint
  getDocuments: async (complaintId) => {
    const response = await axios.get(`${BASE_URL}/${complaintId}/documents`);
    return response.data;
  },

  // Download a specific document
  downloadDocument: async (complaintId, documentId) => {
    const response = await axios.get(
      `${BASE_URL}/${complaintId}/documents/${documentId}/download`,
      {
        responseType: "blob",
      },
    );
    return response;
  },
};
