import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),
    tagTypes: ['events'],
    endpoints: (builder) => ({
        getAllEvents: builder.query({
            query: () => 'events',
            providesTags: ['events']
        })
    })
})