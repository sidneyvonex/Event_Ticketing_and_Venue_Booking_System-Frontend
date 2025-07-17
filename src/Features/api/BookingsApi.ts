import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";

export const bookingsApi = createApi({
    reducerPath:'bookingsApi',
    baseQuery: fetchBaseQuery({baseUrl:'http://localhost:3000/api',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
          },
    }),
    
    tagTypes:['bookings'],
    refetchOnReconnect:true,
    refetchOnMountOrArgChange:true,
    endpoints:(builder)=>({
        getAllBooks:builder.query({
            query:() => 'bookings',
            providesTags:['bookings']
        }),
        createBook:builder.mutation({
            query:(createBookingPayload)=>({
                url:'bookings',
                method:'POST',
                body:createBookingPayload,
            }),
            invalidatesTags:['bookings'],
        }),
        getAllBookingsForUserId:builder.query({
            query:(userId) => `bookings/user?userId=${userId}`,
            providesTags:['bookings']
        }),
        updateBookings:builder.mutation({
            query:({bookingId,...bookingsDataPayload}) =>({
                url:`bookings/${bookingId}`,
                method:'PUT',
                body:bookingsDataPayload,
            }),
            invalidatesTags:['bookings']
        }),
        deleteBookings:builder.mutation({
            query:(bookingId) => ({
                url:`bookings/${bookingId}`,
                method:'DELETE',
            }),
            invalidatesTags:['bookings']
        })
    })
})

// Export hooks for usage in functional components
export const { 
    useGetAllBooksQuery,
    useCreateBookMutation,
    useGetAllBookingsForUserIdQuery,
    useUpdateBookingsMutation,
    useDeleteBookingsMutation
} = bookingsApi;