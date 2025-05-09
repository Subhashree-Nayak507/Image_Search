import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  images: [],
  searchHistory: [],
  isLoading: false,
  error: null,
  attribution: "",
  source: "",
};

const baseURL = process.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export const searchImages = createAsyncThunk(
  "search/images",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${baseURL}/search/image`,
        {
          params: { search: query },
          withCredentials: true,
        }
      );
      
      if (!response.data || !response.data.images || !Array.isArray(response.data.images)) {
        return rejectWithValue({ message: "Invalid response format from server" });
      }
      
      const formattedImages = response.data.images.map(img => ({
        id: img.id,
        url: img.webformatURL,
        webformatURL: img.webformatURL,
        thumbnailUrl: img.previewURL,
        previewURL: img.previewURL,
        title: img.tags && img.tags.length > 0 ? img.tags[0] : 'Image',
        description: img.tags && img.tags.length > 1 ? img.tags.slice(1).join(', ') : 'No description available',
        alt: img.tags ? img.tags.join(', ') : 'Image search result',
        tags: img.tags || []
      }));
      
      console.log("Formatted images data:", formattedImages);
      
      return {
        images: formattedImages,
        attribution: response.data.attribution || "",
        source: response.data.source || ""
      };
    } catch (error) {
      console.error("Error searching images:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to search images"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearImages: (state) => {
      state.images = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Images
      .addCase(searchImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload.images;
        state.attribution = action.payload.attribution;
        state.source = action.payload.source;
      })
      .addCase(searchImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to search images";
      })
  },
});

export const { clearImages, clearError } = searchSlice.actions;
export default searchSlice.reducer;