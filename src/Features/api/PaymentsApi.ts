import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { backendUrl } from "../../BackendUrl";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["payments"],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    
    // Get all payments (admin only)
    getAllPayments: builder.query({
      query: () => "payments",
      providesTags: ["payments"],
    }),

    // Get payments for a specific user
    getAllPaymentsForUserId: builder.query({
      query: (userId) => `payments/user?userId=${userId}`,
      providesTags: ["payments"],
    }),

    // Get payment by ID
    getPaymentById: builder.query({
      query: (paymentId) => `payments/${paymentId}`,
      providesTags: ["payments"],
    }),

    // Get payments for a specific booking
    getPaymentsByBookingId: builder.query({
      query: (bookingId) => `payments/booking/${bookingId}`,
      providesTags: ["payments"],
    }),

    // Create new payment
    createPayment: builder.mutation({
      query: (createPaymentPayload) => ({
        url: "payments",
        method: "POST",
        body: createPaymentPayload,
      }),
      invalidatesTags: ["payments"],
    }),

    // Update payment status (for processing, confirming, etc.)
    updatePaymentStatus: builder.mutation({
      query: ({ paymentId, ...updatePayload }) => ({
        url: `payments/${paymentId}`,
        method: "PUT",
        body: updatePayload,
      }),
      invalidatesTags: ["payments"],
    }),

    // Process refund
    // processRefund: builder.mutation({
    //   query: ({ paymentId, refundAmount, reason }) => ({
    //     url: `payments/${paymentId}/refund`,
    //     method: "POST",
    //     body: { refundAmount, reason },
    //   }),
    //   invalidatesTags: ["payments"],
    // }),

    // Verify payment (webhook or manual verification)
    // verifyPayment: builder.mutation({
    //   query: ({ paymentId, transactionId }) => ({
    //     url: `payments/${paymentId}/verify`,
    //     method: "POST",
    //     body: { transactionId },
    //   }),
    //   invalidatesTags: ["payments"],
    // }),

    // Get payment statistics (for dashboard)
    // getPaymentStats: builder.query({
    //   query: (userId) => `payments/stats${userId ? `?userId=${userId}` : ""}`,
    //   providesTags: ["payments"],
    // }),

    // Download payment receipt
    // downloadReceipt: builder.query({
    //   query: (paymentId) => `payments/${paymentId}/receipt`,
    //   providesTags: ["payments"],
    // }),

    // Get payment methods available
    // getPaymentMethods: builder.query({
    //   query: () => "payments/methods",
    //   providesTags: ["payments"],
    // }),

    // Cancel payment (if still pending)
    // cancelPayment: builder.mutation({
    //   query: (paymentId) => ({
    //     url: `payments/${paymentId}/cancel`,
    //     method: "POST",
    //   }),
    //   invalidatesTags: ["payments"],
    // }),

    // Retry failed payment
    // retryPayment: builder.mutation({
    //   query: ({ paymentId, paymentMethod }) => ({
    //     url: `payments/${paymentId}/retry`,
    //     method: "POST",
    //     body: { paymentMethod },
    //   }),
    //   invalidatesTags: ["payments"],
    // }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetAllPaymentsForUserIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentStatusMutation,
} = paymentsApi;

