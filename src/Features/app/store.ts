import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";

//Creating  a Persist config for auth Slice
import { persistStore,persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage' // defaults to web Local Sorage
import authReducer from "../auth/authSlice"
import { eventApi } from "../api/EventApi";
import { bookingsApi } from "../api/BookingsApi";
import { supportTicketApi } from "../api/SupportTicketApi";
import { venueApi } from "../api/VenueApi";
import { paymentsApi } from "../api/PaymentsApi";
import { uploadApi } from "../api/uploadApi";

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
        [bookingsApi.reducerPath]:bookingsApi.reducer,
        [supportTicketApi.reducerPath]:supportTicketApi.reducer,
        [venueApi.reducerPath]:venueApi.reducer,
        [paymentsApi.reducerPath]:paymentsApi.reducer,
        [uploadApi.reducerPath]:uploadApi.reducer,

        //Persist reducer

        auth:persistedAuthReducer
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        }).concat(userApi.middleware,eventApi.middleware,bookingsApi.middleware,venueApi.middleware,supportTicketApi.middleware,paymentsApi.middleware,uploadApi.middleware)
})

//Export Persist Store
export const persistor = persistStore(store)

//infering types of rootStates

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch