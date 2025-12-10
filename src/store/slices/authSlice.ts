import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { refreshTokensApi, getCurrentUserApi } from "../../api/authApi";
import { AuthState } from "../../types/auth";
import { UserDto } from "../../types/user";

export const refreshTokens = createAsyncThunk<string>("auth/refresh", async () => {
  const data = await refreshTokensApi();
  return data.accessToken;
});

export const fetchCurrentUser = createAsyncThunk<UserDto>("auth/fetchCurrentUser", async () => {
  return await getCurrentUserApi();
});

const initialState: AuthState = {
  accessToken: sessionStorage.getItem("accessToken"),
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.error = null;
      sessionStorage.setItem("accessToken", action.payload);
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.error = null;
      sessionStorage.removeItem("accessToken");
    },
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshTokens.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
        state.error = null;
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to refresh token";
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user data";
      });
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
