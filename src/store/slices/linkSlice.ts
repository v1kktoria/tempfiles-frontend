import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LinkDto, CreateLinkDto } from "../../types/link";
import { createLinkApi, getUserLinksApi, deactivateLinkApi, activateLinkApi } from "../../api/linkApi";

export const createLink = createAsyncThunk("links/create", async (data: CreateLinkDto): Promise<LinkDto> => {
  return await createLinkApi(data);
});

export const fetchUserLinks = createAsyncThunk("links/fetchUserLinks", async (): Promise<LinkDto[]> => {
  return await getUserLinksApi();
});

export const deactivateLink = createAsyncThunk("links/deactivate", async (token: string): Promise<string> => {
  await deactivateLinkApi(token);
  return token;
});

export const activateLink = createAsyncThunk("links/activate", async (token: string): Promise<string> => {
  await activateLinkApi(token);
  return token;
});

interface LinkState {
  links: LinkDto[];
  loading: boolean;
  error: string | null;
}

const initialState: LinkState = {
  links: [],
  loading: false,
  error: null,
};

const linkSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLink.fulfilled, (state, action) => {
        state.loading = false;
        state.links.push(action.payload);
      })
      .addCase(createLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create link";
      })

      .addCase(fetchUserLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload;
      })
      .addCase(fetchUserLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch links";
      })

      .addCase(deactivateLink.fulfilled, (state, action) => {
        const token = action.payload;
        state.links = state.links.map((link) => (link.token === token ? { ...link, isActive: false } : link));
      })

      .addCase(activateLink.fulfilled, (state, action) => {
        const token = action.payload;
        state.links = state.links.map((link) => (link.token === token ? { ...link, isActive: true } : link));
      });
  },
});

export const { clearError } = linkSlice.actions;
export default linkSlice.reducer;
