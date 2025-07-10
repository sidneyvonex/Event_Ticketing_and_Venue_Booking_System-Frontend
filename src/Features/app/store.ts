import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";

export const store = configureStore({
    reducer:{
        [userApi.reducerPath]:userApi.reducer,
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        }).concat(userApi.middleware)
})

//infering types of rootStates

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch