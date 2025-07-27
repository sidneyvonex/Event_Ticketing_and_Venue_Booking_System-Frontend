import { createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type { RootState } from '../app/store';
import { backendUrl } from '../../BackendUrl';


export const userApi = createApi({
    reducerPath:'userApi',
    baseQuery:fetchBaseQuery({baseUrl:backendUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
        headers.set('Authorization', `${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    }, 
    }),
    tagTypes:['users','user'],
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
        getUserById:builder.query({
            query:(userId) => `users/${userId}`,
            providesTags:['user']
        }),
        updateUserProfile: builder.mutation({
        query: ({ userId, ...patch }) => ({
            url: `users/${userId}`,
            method: 'PUT',
            body: patch,
        }),
        invalidatesTags: ["user", "users"]
        }),
        changePassword: builder.mutation({
            query: ({ userId, currentPassword, newPassword }) => ({
                url: `users/${userId}/change-password`,
                method: 'PATCH',
                body: { currentPassword, newPassword },
            }),
        }),
        updateProfilePicture: builder.mutation({
            query: ({ userId, profilePictureUrl, profilePicture }) => {
                console.log("updateProfilePicture API payload:", { 
                    userId, 
                    profilePictureUrl, 
                    profilePicture 
                });
                
                return {
                    url: `users/${userId}/profile-picture`,
                    method: 'PATCH',
                    body: { 
                        profilePictureUrl: profilePictureUrl || profilePicture,
                        profilePicture: profilePicture || profilePictureUrl,
                        // Send both to handle different backend expectations
                    },
                };
            },
            invalidatesTags: ["user", "users"]
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

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetAllUserProfilesQuery,
    useGetUserByIdQuery,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
    useUpdateProfilePictureMutation,
    useDeleteUserMutation
} = userApi;