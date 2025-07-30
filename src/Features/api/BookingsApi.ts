/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { backendUrl } from "../../BackendUrl";

export const bookingsApi = createApi({
    reducerPath:'bookingsApi',
    baseQuery: fetchBaseQuery({baseUrl:backendUrl,
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
        createBooking:builder.mutation({
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
        }),
        bookAndPayMpesa: builder.mutation<any, { userId: number; eventId: number; quantity: number; totalAmount: number }>({
            query: (body) => ({
                url: 'bookings/mpesa',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['bookings'],
        }),
    })
})

// Export hooks for usage in functional components
export const { 
    useGetAllBooksQuery,
    useCreateBookingMutation,
    useGetAllBookingsForUserIdQuery,
    useUpdateBookingsMutation,
    useDeleteBookingsMutation,
    useBookAndPayMpesaMutation,
} = bookingsApi;

