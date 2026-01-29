import axiosInstance from './axiosInstance';

export const downloadEpicCard = async (epicNumber) => {
  const response = await axiosInstance.get(`/api/v1/public/epic/download/${epicNumber}`, {
    responseType: 'blob'
  });
  
  // Create blob and download
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `EPIC_${epicNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  
  return response.data;
  
};

export const validateEpicNumber = async (epicNumber) => {
  const response = await axiosInstance.get(`/api/v1/public/epic/validate/${epicNumber}`);
  return response.data;
};