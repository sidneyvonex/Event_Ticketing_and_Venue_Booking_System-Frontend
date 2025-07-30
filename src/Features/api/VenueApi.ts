import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";

const baseUrl= import.meta.env.VITE_API_BASE_URL


export const venueApi = createApi({
  reducerPath: "venueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
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

export const {
  useCreateVenueMutation,
  useGetAllVenuesQuery,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
} = venueApi;