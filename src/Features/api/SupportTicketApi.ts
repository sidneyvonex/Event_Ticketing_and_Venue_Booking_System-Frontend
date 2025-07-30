import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import type { RootState } from "../app/store";


const baseUrl= import.meta.env.VITE_API_BASE_URL

export const supportTicketApi = createApi({
    reducerPath:'supportTicketApi',
    baseQuery:fetchBaseQuery({baseUrl:baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    refetchOnMountOrArgChange:true,
    refetchOnReconnect:true,
    tagTypes:['supportTickets'],
    endpoints:(builder)=>({
        // Create new support ticket
        createSupportTicket:builder.mutation({
            query:(supportTicketData)=>({
                url:'tickets',
                method:'POST',
                body:supportTicketData
            }),
            invalidatesTags:['supportTickets']
        }),
        
        // Update support ticket status
        updateSupportTicket:builder.mutation({
            query:({ticketId, supportTicketStatus})=>({
                url:`tickets/${ticketId}`,
                method:'PUT',
                body:{
                    userId: 1, // This will be handled by backend middleware
                    subject: "Updated", // This will be handled by backend middleware  
                    description: "Updated", // This will be handled by backend middleware
                    category: "Updated", // This will be handled by backend middleware
                    supportTicketStatus
                }
            }),
            invalidatesTags:['supportTickets']
        }),
        
        // Get all support tickets (admin)
        getAllSupportTickets:builder.query({
            query:() => 'tickets',
            providesTags:['supportTickets']
        }),
        
        // Get support tickets by user ID
        getSupportTicketsByUserId:builder.query({
            query:(userId) => `tickets/user?userId=${userId}`,
            providesTags:['supportTickets']
        }),
        
        // Get support ticket by ID
        getSupportTicketById:builder.query({
            query:(ticketId) => `tickets/${ticketId}`,
            providesTags:['supportTickets']
        }),
        
        // Delete support ticket
        deleteSupportTicket:builder.mutation({
            query:(ticketId)=>({
                url:`tickets/${ticketId}`,
                method:'DELETE',
            }),
            invalidatesTags:['supportTickets']
        }),
        
        // Add response to a support ticket
        addSupportTicketResponse:builder.mutation({
            query:({ticketId, responderId, responderType, message})=>({
                url:`tickets/${ticketId}/responses`,
                method:'POST',
                body:{
                    responderId,
                    responderType,
                    message
                }
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
    useCreateSupportTicketMutation,
    useUpdateSupportTicketMutation,
    useGetAllSupportTicketsQuery,
    useGetSupportTicketsByUserIdQuery,
    useGetSupportTicketByIdQuery,
    useDeleteSupportTicketMutation,
    useAddSupportTicketResponseMutation,
    useGetSupportTicketResponsesQuery,
    useGetSupportTicketWithResponsesQuery
} = supportTicketApi;
