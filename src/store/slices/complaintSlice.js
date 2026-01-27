import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  epicNumber: "",
  complaintType: "",
  subject: "",
  description: "",
  assemblyConstituency: null,
  pollingStation: null,
  priority: "MEDIUM",


  assemblies: [],
  pollingStations: [],


  isLoading: false,
  error: null,
  submitSuccess: false,
};

const complaintSlice = createSlice({
  name: "complaint",
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
  setSuccess,
} = complaintSlice.actions;

export default complaintSlice.reducer;
