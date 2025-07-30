import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import expireReducer from "redux-persist-transform-expire";

import authReducer from "../auth/authSlice";
import { userApi } from "../api/userApi";
import { eventApi } from "../api/EventApi";
import { bookingsApi } from "../api/BookingsApi";
import { supportTicketApi } from "../api/SupportTicketApi";
import { venueApi } from "../api/VenueApi";
import { paymentsApi } from "../api/PaymentsApi";
import { uploadApi } from "../api/uploadApi";

// ✅ Correct expireReducer config
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "userRole", "isAuthenticated"],
  transforms: [
    expireReducer({
      key: "token",
      expireSeconds: 3600,
      expiredState: null,
    }),
    expireReducer({
      key: "user",
      expireSeconds: 3600,
      expiredState: null,
    }),
    expireReducer({
      key: "userRole",
      expireSeconds: 3600,
      expiredState: null,
    }),
    expireReducer({
      key: "isAuthenticated",
      expireSeconds: 3600,
      expiredState: false,
    }),
  ],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [userApi.reducerPath]: userApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [supportTicketApi.reducerPath]: supportTicketApi.reducer,
    [venueApi.reducerPath]: venueApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      userApi.middleware,
      eventApi.middleware,
      bookingsApi.middleware,
      supportTicketApi.middleware,
      venueApi.middleware,
      paymentsApi.middleware,
      uploadApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
