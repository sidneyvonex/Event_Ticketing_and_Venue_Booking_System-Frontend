 
import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";


const baseUrl= import.meta.env.VITE_API_BASE_URL

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
        },

     }),
     refetchOnReconnect:true,
     refetchOnMountOrArgChange:true,
    tagTypes: ['events'],
    endpoints: (builder) => ({
        getAllEvents: builder.query({
            query: () => 'events',
            providesTags: ['events']
        }),
        getEventById: builder.query({
            query: (eventId) => `events/${eventId}`,
            providesTags: ['events']
        }),
        createEvent: builder.mutation({
            query: (createEventPayload) => {
                return {
                    url: 'events',
                    method: 'POST',
                    body: createEventPayload,
                };
            },
            invalidatesTags: ['events']
        }),
        updateEvent: builder.mutation({
            query: ({ eventId, ...eventDataPayload }) => {
                return {
                    url: `events/${eventId}`,
                    method: 'PUT',
                    body: eventDataPayload,
                };
            },
            invalidatesTags: ['events']
        }),
        deleteEvent: builder.mutation({
            query: (eventId) => ({
                url: `events/${eventId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['events']
        })
    })
})

// Export hooks for usage in functional components
export const {
    useGetAllEventsQuery,
    useGetEventByIdQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation
} = eventApi;