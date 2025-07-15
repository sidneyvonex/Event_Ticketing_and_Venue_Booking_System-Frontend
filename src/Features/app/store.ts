import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";

//Creating  a Persist config for auth Slice
import { persistStore,persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage' // defaults to web Local Sorage
import authReducer from "../auth/authSlice"
import { eventApi } from "../api/EventApi";

const authPersistConfig ={
    key:'auth',
    storage,
    whitelist:[
        'user','token','userRole','isAuthenticated','profileUrl'
    ] // Specifys parts of state that need to be persisted
}

//create a persisted reducer for authSlice
const persistedAuthReducer = persistReducer(authPersistConfig,authReducer)

export const store = configureStore({
    reducer:{
        [userApi.reducerPath]:userApi.reducer,
        [eventApi.reducerPath]:eventApi.reducer,

        //Persist reducer

        auth:persistedAuthReducer
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        }).concat(userApi.middleware,eventApi.middleware)
})

//Export Persist Store
export const persistor = persistStore(store)

//infering types of rootStates

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch