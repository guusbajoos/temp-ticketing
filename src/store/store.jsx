import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "pages/Login/store/login.slice";

const combinedReducer = combineReducers({
  login: loginSlice.reducer,
  //   app: appSlice.reducer,
  //   auth: authSlice.reducer,
  //   examples: moduleNameSlice.reducer,
  //   histories: historiesSlice.reducer,
});

export const reduxStore = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
  devTools: {
    trace: false,
  },
});
