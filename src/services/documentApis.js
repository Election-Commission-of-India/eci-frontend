
 import axios from "axios";
import { API_BASE_URL } from "./apis";
export const documentApis = {

  uploadDocument: async (applicationId, file, documentType, documentSubType) => {
    const formData = new FormData();
   
    formData.append('file', file);
    
    
    const metadata = {
      documentType: documentType,
      documentSubType: documentSubType
    };
    
    formData.append(
      'data',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );

    const response = await axios.post(
      `${API_BASE_URL}/applications/${applicationId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

 
  getDocuments: async (applicationId) => {
    const response = await axios.get(
      `${API_BASE_URL}/applications/${applicationId}/documents`
    );
    return response.data;
  },

 
  downloadDocument: async (applicationId, documentId) => {
    const response = await axios.get(
      `${API_BASE_URL}/applications/${applicationId}/documents/${documentId}/download`,
      {
        responseType: 'blob', 
      }
    );
    return response;
  },
};