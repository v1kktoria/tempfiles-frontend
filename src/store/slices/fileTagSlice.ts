import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TagDto, FileTagDto } from "../../types/tag";
import { FileTagState } from "../../types/file";
import { assignTagToFileApi, getFileTagsApi, removeTagFromFileApi } from "../../api/fileTagApi";

export const assignTagToFile = createAsyncThunk<FileTagDto, { fileId: string; tagId: string }>(
  "fileTags/assign",
  async ({ fileId, tagId }) => await assignTagToFileApi(fileId, tagId),
);

export const fetchFileTags = createAsyncThunk<TagDto[], string>(
  "fileTags/fetchByFile",
  async (fileId) => await getFileTagsApi(fileId),
);

export const removeTagFromFile = createAsyncThunk<{ fileId: string; tagId: string }, { fileId: string; tagId: string }>(
  "fileTags/remove",
  async ({ fileId, tagId }) => {
    await removeTagFromFileApi(fileId, tagId);
    return { fileId, tagId };
  },
);

const initialState: FileTagState = {
  fileTags: {},
  loading: false,
  error: null,
};

const fileTagSlice = createSlice({
  name: "fileTags",
  initialState,
  reducers: {
    clearFileTags: (state) => {
      state.fileTags = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignTagToFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTagToFile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(assignTagToFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to assign tag to file";
      })

      .addCase(fetchFileTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFileTags.fulfilled, (state, action) => {
        state.loading = false;
        const fileId = action.meta.arg;
        state.fileTags[fileId] = action.payload;
      })
      .addCase(fetchFileTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load file tags";
      })

      .addCase(removeTagFromFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTagFromFile.fulfilled, (state, action) => {
        state.loading = false;
        const { fileId, tagId } = action.payload;

        if (state.fileTags[fileId]) {
          state.fileTags[fileId] = state.fileTags[fileId].filter((tag) => tag.id !== tagId);
        }
      })
      .addCase(removeTagFromFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove tag from file";
      });
  },
});

export const { clearFileTags } = fileTagSlice.actions;
export default fileTagSlice.reducer;
