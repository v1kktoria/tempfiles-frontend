import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import fileReducer from "./slices/fileSlice";
import tagReducer from "./slices/tagSlice";
import fileTagReducer from "./slices/fileTagSlice";
import linkReducer from "./slices/linkSlice";
import userReducer from "./slices/userSlice";
import groupsReducer from "./slices/groupSlice";

const loadInitialState = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  return {
    auth: {
      accessToken,
      user: null,
      loading: false,
      error: null,
    },
  };
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    tags: tagReducer,
    fileTags: fileTagReducer,
    links: linkReducer,
    users: userReducer,
    groups: groupsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: loadInitialState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
