import { createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type { RootState } from '../app/store';


export const userApi = createApi({
    reducerPath:'userApi',
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
    tagTypes:['users'],
    refetchOnMountOrArgChange:true,
    refetchOnReconnect:true,
    endpoints:(builder) =>({
        registerUser:builder.mutation({
            query:(registerPayload) =>({
                url:'auth/register',
                method:'POST',
                body:registerPayload
            }),
        }),
        loginUser:builder.mutation({
            query:(loginPayload) =>({
                url:'auth/login',
                method:'POST',
                body:loginPayload
            }),
            invalidatesTags:["users"]
        }),
        getAllUserProfiles:builder.query({
            query:() => 'users',
            providesTags:['users']
        }),
        updateUser:builder.mutation({
            query:({userId,...userDataPayload}) =>({
                url:`users/${userId}`,
                method:'PUT',
                body:userDataPayload
            }),
            invalidatesTags:['users']
        }),
        deleteUser:builder.mutation({
            query:(userId) =>({
                url:`users/${userId}`,
                method:'DELETE',
            }),
            invalidatesTags:['users']
        })
    })
})