import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateTagDto, TagState } from "../../types/tag";
import { createTagApi, getAllTagsApi, deleteTagApi } from "../../api/tagApi";

export const fetchTags = createAsyncThunk("tags/fetchAll", async () => {
  return await getAllTagsApi();
});

export const createTag = createAsyncThunk("tags/create", async (data: CreateTagDto) => {
  return await createTagApi(data);
});

export const deleteTag = createAsyncThunk("tags/delete", async (id: string) => {
  await deleteTagApi(id);
  return id;
});

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tags";
      })

      .addCase(createTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })

      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter((tag) => tag.id !== action.payload);
      });
  },
});

export const { clearError } = tagSlice.actions;
export default tagSlice.reducer;
