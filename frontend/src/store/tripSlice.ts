import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { generateTrip } from "../api/tripApi";
import type { GenerateTripRequest, Itinerary } from "../types/trip";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface TripState {
  request: GenerateTripRequest | null;
  itinerary: Itinerary | null;
  status: RequestStatus;
  error: string | null;
}

const initialState: TripState = {
  request: null,
  itinerary: null,
  status: "idle",
  error: null,
};

export const generateTripThunk = createAsyncThunk<
  Itinerary,
  GenerateTripRequest,
  { rejectValue: string }
>("trip/generate", async (request, { rejectWithValue }) => {
  try {
    return await generateTrip(request);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return rejectWithValue(message);
  }
});

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setRequest(state, action: PayloadAction<GenerateTripRequest>) {
      state.request = action.payload;
    },
    resetTrip() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTripThunk.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.request = action.meta.arg;
      })
      .addCase(generateTripThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.itinerary = action.payload;
      })
      .addCase(generateTripThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "The itinerary could not be generated.";
      });
  },
});

export const { setRequest, resetTrip } = tripSlice.actions;
export default tripSlice.reducer;
