import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyGroupsApi,
  getMyRoleInGroupApi,
  createGroupApi,
  updateGroupApi,
  deleteGroupApi,
  getGroupMembersApi,
  addUserToGroupApi,
  removeUserFromGroupApi,
  getGroupByIdApi,
  leaveGroupApi,
} from "../../api/groupApi";
import { AddUserToGroupDto, CreateGroupDto, GroupDto, GroupState, UpdateGroupDto } from "../../types/group";

export const fetchMyGroups = createAsyncThunk<GroupDto[]>("groups/fetchMy", async () => await getMyGroupsApi());

export const fetchMyRoleInGroup = createAsyncThunk<{ groupId: string; role: string }, string>(
  "groups/fetchMyRole",
  async (groupId) => {
    const response = await getMyRoleInGroupApi(groupId);
    return { groupId, role: response.role };
  },
);

export const createGroup = createAsyncThunk<GroupDto, CreateGroupDto>(
  "groups/create",
  async (dto) => await createGroupApi(dto),
);

export const updateGroup = createAsyncThunk<GroupDto, { id: string; dto: UpdateGroupDto }>(
  "groups/update",
  async ({ id, dto }) => await updateGroupApi(id, dto),
);

export const deleteGroup = createAsyncThunk<void, string>("groups/delete", async (id) => await deleteGroupApi(id));

export const fetchGroupMembers = createAsyncThunk<{ groupId: string; members: any[] }, string>(
  "groups/fetchMembers",
  async (groupId) => {
    const members = await getGroupMembersApi(groupId);
    return { groupId, members };
  },
);

export const addUserToGroup = createAsyncThunk<void, { groupId: string; dto: AddUserToGroupDto }>(
  "groups/addUser",
  async ({ groupId, dto }) => await addUserToGroupApi(groupId, dto),
);

export const removeUserFromGroup = createAsyncThunk<void, { groupId: string; userId: string }>(
  "groups/removeUser",
  async ({ groupId, userId }) => await removeUserFromGroupApi(groupId, userId),
);

export const fetchGroupById = createAsyncThunk<GroupDto, string>(
  "groups/fetchById",
  async (id) => await getGroupByIdApi(id),
);

export const leaveGroup = createAsyncThunk<void, string>(
  "groups/leave",
  async (groupId) => await leaveGroupApi(groupId),
);

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  members: {},
  userRoles: {},
  loading: false,
  error: null,
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load groups";
      })

      .addCase(fetchMyRoleInGroup.fulfilled, (state, action) => {
        const { groupId, role } = action.payload;
        state.userRoles[groupId] = role;
      })

      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create group";
      })

      .addCase(updateGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex((group) => group.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        if (state.currentGroup?.id === action.payload.id) {
          state.currentGroup = action.payload;
        }
      })

      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((group) => group.id !== action.meta.arg);
        if (state.currentGroup?.id === action.meta.arg) {
          state.currentGroup = null;
        }
      })

      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      })

      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        const { groupId, members } = action.payload;
        state.members[groupId] = members;
      })

      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((group) => group.id !== action.meta.arg);
      });
  },
});

export const { clearError, clearCurrentGroup } = groupSlice.actions;
export default groupSlice.reducer;
