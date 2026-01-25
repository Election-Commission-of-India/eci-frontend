import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  // Form data
  firstName: "",
  lastName: "",
  fullName: "",
  dob: "",
  gender: "",
  fatherName: "",
  motherName: "",
  marital_status: false,
  address: "",
  city: "",
  postalCode: "",
  assemblyConstituencyId: null,
  pollingStationId: null,
  partNumber: null,
  photoPath: "",
  assemblyName :"",
  pollingName:"",
  
  // Dropdown options
  assemblies: [],
  pollingStations: [],
  
  // Loading states
  isLoading: false,
  error: null,
  submitSuccess: false
};

const form6Slice = createSlice({
  name: "form6",
  initialState,
  reducers: {
    // Rule 1: Update a single field
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
    // Rule 2: Reset entire form
    resetForm: () => {
      return initialState;
    },

    // Rule 3: Start loading
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Rule 4: Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Rule 5: Success
    setSuccess: (state) => {
      state.submitSuccess = true;
      state.isLoading = false;
    },
  },
});

// Export the rules so components can use them
export const { updateField, resetForm, setLoading, setError, setSuccess, setAssemblies,setPollingStations } =
  form6Slice.actions;
export default form6Slice.reducer;
