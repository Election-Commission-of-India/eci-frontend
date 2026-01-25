import { createSlice } from '@reduxjs/toolkit';

const initialState = {

  relatedEpicNumber: "",
  
  
  voterDetails: null,
  fetchingVoter: false,
  voterNotFound: false,
  

  fieldToCorrect: "",
  oldValue: "", // Auto-filled from voterDetails
  newValue: "",

  assemblyConstituencyId: null,
  pollingStationId: null,
  

  assemblies: [],
  pollingStations: [],

  isLoading: false,
  error: null,
  submitSuccess: false,
};

const form8Slice = createSlice({
  name: 'form8',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { fieldName, value } = action.payload;
      state[fieldName] = value;
    },
    
    setVoterDetails: (state, action) => {
      state.voterDetails = action.payload;
      state.voterNotFound = false;
      state.fetchingVoter = false;
    },
    
    setFetchingVoter: (state, action) => {
      state.fetchingVoter = action.payload;
    },
    
    setVoterNotFound: (state) => {
      state.voterNotFound = true;
      state.voterDetails = null;
      state.fetchingVoter = false;
    },
    
    setAssemblies: (state, action) => {
      state.assemblies = action.payload;
    },
    
    setPollingStations: (state, action) => {
      state.pollingStations = action.payload;
    },
    
    resetForm: () => {
      return initialState;
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    setSuccess: (state) => {
      state.submitSuccess = true;
      state.isLoading = false;
    },
  },
});

export const { 
  updateField, 
  setVoterDetails,
  setFetchingVoter,
  setVoterNotFound,
  setAssemblies, 
  setPollingStations,
  resetForm, 
  setLoading, 
  setError, 
  setSuccess 
} = form8Slice.actions;

export default form8Slice.reducer;
