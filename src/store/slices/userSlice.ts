import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsersApi, getUserByIdApi, updateUserApi, deleteUserApi, banUserApi, unbanUserApi } from "../../api/userApi";
import { UserDto, UpdateUserDto, UsersState } from "../../types/user";

export const fetchUsers = createAsyncThunk<UserDto[]>("users/fetchAll", async () => {
  return await getUsersApi();
});

export const fetchUserById = createAsyncThunk<UserDto, string>("users/fetchById", async (id) => {
  return await getUserByIdApi(id);
});

export const updateUser = createAsyncThunk<UserDto, { id: string; data: UpdateUserDto }>(
  "users/update",
  async ({ id, data }) => {
    return await updateUserApi(id, data);
  },
);

export const deleteUser = createAsyncThunk<string, string>("users/delete", async (id) => {
  await deleteUserApi(id);
  return id;
});

export const banUser = createAsyncThunk<UserDto, string>("users/ban", async (id) => {
  return await banUserApi(id);
});

export const unbanUser = createAsyncThunk<UserDto, string>("users/unban", async (id) => {
  return await unbanUserApi(id);
});

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      })

      .addCase(banUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(banUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to ban user";
      })

      .addCase(unbanUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to unban user";
      });
  },
});

export const { clearError, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
