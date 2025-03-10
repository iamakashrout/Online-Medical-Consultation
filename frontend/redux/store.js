const { configureStore } = require("@reduxjs/toolkit");
import themeReducer from "./themeSlice";
export const store = configureStore({
    reducer: {
      theme: themeReducer,
    },
  });