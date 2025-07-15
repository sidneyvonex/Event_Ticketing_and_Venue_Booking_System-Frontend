import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import type { RootState } from "../app/store";


export const supportTicketApi = createApi({
    reducerPath:'supportTicketApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:3000/api',
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
        deleteSupportTicket:builder.mutation({
            query:(ticketId)=>({
                url:`tickets/${ticketId}`,
                method:'DELETE',
            }),
            invalidatesTags:['supportTickets']
        })
    })
})