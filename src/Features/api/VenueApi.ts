import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";

export const venueApi = createApi({
  reducerPath: "venueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://event-ticketing-and-venue-booking-system.onrender.com/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["venues"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    createVenue: builder.mutation({
      query: (createVenuePayload) => ({
        url: "venues",
        method: "POST",
        body: createVenuePayload,
      }),
      invalidatesTags: ["venues"],
    }),
    getAllVenues: builder.query({
      query: () => "venues",
      providesTags: ["venues"],
    }),
    updateVenue: builder.mutation({
      query: ({ venueId, ...venueDataPayload }) => ({
        url: `venues/${venueId}`,
        method: "PUT",
        body: venueDataPayload,
      }),
      invalidatesTags: ["venues"],
    }),
    deleteVenue: builder.mutation({
      query: (venueId) => ({
        url: `venues/${venueId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["venues"],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateVenueMutation,
  useGetAllVenuesQuery,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
} = venueApi;
