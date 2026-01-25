import { configureStore } from "@reduxjs/toolkit";
import form6Reducer from "./slices/form6Slice";
import form8Reduce from "./slices/form8slice"

const store = configureStore({
  reducer: {
    form6: form6Reducer,
    form8:  form8Reduce,
  },
});

export default store;
