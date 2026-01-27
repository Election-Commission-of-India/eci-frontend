import axiosInstance from './axiosInstance.js';

// Voter Search APIs based on VoterSearchController
export const searchVotersByName = async (name) => {
  const response = await axiosInstance.get(`/api/v1/voters/search/name?name=${encodeURIComponent(name)}`);
  return response.data;
};

export const searchVoterByEpic = async (epicNumber) => {
  const response = await axiosInstance.get(`/api/v1/voters/search/epic/${epicNumber}`);
  return response.data;
};

export const searchVotersByRelative = async (relativeName) => {
  const response = await axiosInstance.get(`/api/v1/voters/search/relative?relativeName=${encodeURIComponent(relativeName)}`);
  return response.data;
};

export const searchVotersByConstituency = async (constituencyName, constituencyNumber) => {
  const params = new URLSearchParams();
  if (constituencyName) params.append('constituencyName', constituencyName);
  if (constituencyNumber) params.append('constituencyNumber', constituencyNumber);
  
  const response = await axiosInstance.get(`/api/v1/voters/search/constituency?${params.toString()}`);
  return response.data;
};

export const searchVotersByPartNumber = async (constituencyId, partNumber) => {
  const response = await axiosInstance.get(`/api/v1/voters/search/part?constituencyId=${constituencyId}&partNumber=${partNumber}`);
  return response.data;
};

export const searchVotersByAssembly = async (assemblyConstituencyId) => {
  const response = await axiosInstance.get(`/api/v1/voters/search/assembly/${assemblyConstituencyId}`);
  return response.data;
};

export const getVoterDetails = async (voterId) => {
  const response = await axiosInstance.get(`/api/v1/voters/${voterId}`);
  return response.data;
};

export const getPollingStationDetails = async (voterId) => {
  const response = await axiosInstance.get(`/api/v1/voters/${voterId}/polling-station`);
  return response.data;
};

export const getPollingStationMap = async (voterId) => {
  const response = await axiosInstance.get(`/api/v1/voters/${voterId}/polling-station/map`);
  return response.data;
};

export const getPollingStationDirections = async (voterId) => {
  const response = await axiosInstance.get(`/api/v1/voters/${voterId}/polling-station/directions`);
  return response.data;
};

export const downloadVoterSlip = async (voterId) => {
  const response = await axiosInstance.get(`/api/v1/voters/${voterId}/voter-slip`, {
    responseType: 'blob'
  });
  
  // Create blob and trigger download
  const blob = new Blob([response.data]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Extract filename from Content-Disposition header or use default
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'voter-slip.txt';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }
  
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};