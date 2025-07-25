/* eslint-disable @typescript-eslint/no-explicit-any */
// Define Slice
//Persist Function to make sure the res is stored in the Browser local Storage

import {createSlice, type PayloadAction} from "@reduxjs/toolkit"
import  type { AuthState } from "../../types/types"
//Initial State

const initialState:AuthState={
    user:null,
    token:null,
    isAuthenticated:false,
    userRole:null,
    profileUrl:null
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action:PayloadAction<{user:any; token:string,userRole:any,profileUrl:string}>)=>{
            state.user = action.payload;
            state.token= action.payload.token;
            state.userRole=action.payload.userRole;
            state.isAuthenticated = true;
            state.profileUrl=action.payload.profileUrl;
        },
        clearCredentials:(state)=>{
            state.user =null;
            state.token=null;
            state.userRole=null;
            state.isAuthenticated=false;
            state.profileUrl=null;
        }
    }
})

export const {setCredentials,clearCredentials} = authSlice.actions
export default authSlice.reducer