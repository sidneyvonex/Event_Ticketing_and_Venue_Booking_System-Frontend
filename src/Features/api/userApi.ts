import { createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'


export const userApi = createApi({
    reducerPath:'userApi',
    baseQuery:fetchBaseQuery({baseUrl:'http://localhost:3000/api'}),
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
            })
        })
    })
})