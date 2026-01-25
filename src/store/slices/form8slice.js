import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  
  relatedEpicNumber: "",
  

  fieldToCorrect: "",
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
  setAssemblies, 
  setPollingStations,
  resetForm, 
  setLoading, 
  setError, 
  setSuccess 
} = form8Slice.actions;

export default form8Slice.reducer;
