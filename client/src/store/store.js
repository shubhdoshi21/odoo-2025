import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import skillReducer from "./slices/skillSlice";
import swapReducer from "./slices/swapSlice";
import feedbackReducer from "./slices/feedbackSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    skills: skillReducer,
    swaps: swapReducer,
    feedback: feedbackReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
