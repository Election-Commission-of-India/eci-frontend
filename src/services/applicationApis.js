import apiClient from "./apis";

const createApplication = async (data) => {
  const resp = await apiClient.post("/applications", data);
  return resp.data;
};
const getApplication = async (id) =>
  (await apiClient.get(`/applications/${id}/my`)).data;
const getAllApplications = async () =>
  (await apiClient.get("/applications")).data;
const trackStatus = async (id) =>
  (await apiClient.get(`/applications/${id}/track`)).data;

const submitCorrection = async (data) => {
  const response = await apiClient.post(`/applications/correction`, data);
  return response.data;
};
const getVoterByEpic = async (epicNumber) => {
  const response = await apiClient.get(`/applications/epic/${epicNumber}`);
  return response.data;
};

export const applicationAPI = {
  createApplication,
  getApplication,
  getAllApplications,
  trackStatus,
  submitCorrection,
  getVoterByEpic,
};
