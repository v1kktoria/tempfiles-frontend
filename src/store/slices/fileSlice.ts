import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FileDto, CreateFileDto, UpdateFileDto, FileState } from "../../types/file";
import {
  getUserFilesApi,
  uploadFileApi,
  updateFileApi,
  deleteFileApi,
  getFilesByTagApi,
  getFilesByGroupApi,
} from "../../api/fileApi";

export const fetchFiles = createAsyncThunk<FileDto[]>("files/fetch", async () => await getUserFilesApi());

export const fetchFilesByTag = createAsyncThunk<FileDto[], string>(
  "files/fetchByTag",
  async (tagId) => await getFilesByTagApi(tagId),
);

export const fetchFilesByGroup = createAsyncThunk<FileDto[], string>(
  "files/fetchByGroup",
  async (groupId) => await getFilesByGroupApi(groupId),
);

export const uploadFile = createAsyncThunk<FileDto, { file: File; data?: CreateFileDto }>(
  "files/upload",
  async ({ file, data }) => await uploadFileApi(file, data),
);

export const updateFile = createAsyncThunk<FileDto, { id: string; data: UpdateFileDto }>(
  "files/update",
  async ({ id, data }) => await updateFileApi(id, data),
);

export const deleteFile = createAsyncThunk<string, string>("files/delete", async (id) => {
  await deleteFileApi(id);
  return id;
});

const initialState: FileState = {
  files: [],
  filesByTag: {},
  filesByGroup: {},
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFiles.fulfilled, (state, action: PayloadAction<FileDto[]>) => {
        state.loading = false;
        state.files = action.payload;
        state.error = null;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load files";
      })

      .addCase(fetchFilesByTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilesByTag.fulfilled, (state, action) => {
        state.loading = false;
        const tagId = action.meta.arg;
        state.filesByTag[tagId] = action.payload;
      })
      .addCase(fetchFilesByTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load files by tag";
      })

      .addCase(fetchFilesByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilesByGroup.fulfilled, (state, action) => {
        state.loading = false;
        const groupId = action.meta.arg;
        state.filesByGroup[groupId] = action.payload;
        state.error = null;
      })
      .addCase(fetchFilesByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load group files";
      })

      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<FileDto>) => {
        state.loading = false;
        state.files.unshift(action.payload);
        state.error = null;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load files";
      })

      .addCase(updateFile.fulfilled, (state, action: PayloadAction<FileDto>) => {
        state.files = state.files.map((f) => (f.id === action.payload.id ? action.payload : f));
      })

      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.files = state.files.filter((f) => f.id !== action.payload);
      });
  },
});

export default fileSlice.reducer;
