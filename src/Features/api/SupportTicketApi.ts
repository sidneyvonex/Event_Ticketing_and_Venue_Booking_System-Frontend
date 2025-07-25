import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import type { RootState } from "../app/store";


export const supportTicketApi = createApi({
    reducerPath:'supportTicketApi',
    baseQuery:fetchBaseQuery({baseUrl:'https://event-ticketing-and-venue-booking-system.onrender.com/api',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
            headers.set('Authorization', `${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    refetchOnMountOrArgChange:true,
    refetchOnReconnect:true,
    tagTypes:['supportTickets'],
    endpoints:(builder)=>({
        registerSupportTicket:builder.mutation({
            query:(registerSupportTicket)=>({
                url:'tickets',
                method:'POST',
                body:registerSupportTicket
            }),
            invalidatesTags:['supportTickets']
        }),
        updateSupportTicket:builder.mutation({
            query:({ticketId,...SupportTicketPayload})=>({
                url:`tickets/${ticketId}`,
                method:'PUT',
                body:SupportTicketPayload
            }),
            invalidatesTags:['supportTickets']
        }),
        getAllSupportTickets:builder.query({
            query:() => 'tickets',
            providesTags:['supportTickets']
        }),
        getSupportTicketsByUserId:builder.query({
            query:(userId) => `tickets/user?userId=${userId}`,
            providesTags:['supportTickets']
        }),
        deleteSupportTicket:builder.mutation({
            query:(ticketId)=>({
                url:`tickets/${ticketId}`,
                method:'DELETE',
            }),
            invalidatesTags:['supportTickets']
        }),
        
        // Add response to a support ticket
        addSupportTicketResponse:builder.mutation({
            query:({ticketId, ...responsePayload})=>({
                url:`tickets/${ticketId}/responses`,
                method:'POST',
                body:responsePayload
            }),
            invalidatesTags:['supportTickets']
        }),
        
        // Get all responses for a specific ticket
        getSupportTicketResponses:builder.query({
            query:(ticketId) => `tickets/${ticketId}/responses`,
            providesTags:['supportTickets']
        }),
        
        // Get a specific ticket with all its responses
        getSupportTicketWithResponses:builder.query({
            query:(ticketId) => `tickets/${ticketId}/with-responses`,
            providesTags:['supportTickets']
        })
    })
})

export const {
    useRegisterSupportTicketMutation,
    useUpdateSupportTicketMutation,
    useGetAllSupportTicketsQuery,
    useGetSupportTicketsByUserIdQuery,
    useDeleteSupportTicketMutation,
    useAddSupportTicketResponseMutation,
    useGetSupportTicketResponsesQuery,
    useGetSupportTicketWithResponsesQuery
} = supportTicketApi;
