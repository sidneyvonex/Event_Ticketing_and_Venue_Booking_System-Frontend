/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { useGetAllPaymentsQuery } from "../../Features/api/PaymentsApi";
import { useGetAllEventsQuery } from "../../Features/api/EventApi";
import { useGetAllBooksQuery } from "../../Features/api/BookingsApi";

const formatCurrency = (amount: number) =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const SalesReport: React.FC = () => {
  // Payments
  const { data: paymentsResponse = [], isLoading: paymentsLoading } =
    useGetAllPaymentsQuery({});
  // Events
  const { data: eventsResponse = [], isLoading: eventsLoading } =
    useGetAllEventsQuery({});
  // Bookings
  const { data: bookingsResponse = [], isLoading: bookingsLoading } =
    useGetAllBooksQuery({});

  // Normalize API responses (handle .data, .results, or array)
  const payments = Array.isArray(paymentsResponse)
    ? paymentsResponse
    : paymentsResponse.data || paymentsResponse.results || [];
  const events = Array.isArray(eventsResponse)
    ? eventsResponse
    : eventsResponse.data || eventsResponse.results || [];
  const bookings = Array.isArray(bookingsResponse)
    ? bookingsResponse
    : bookingsResponse.data || bookingsResponse.results || [];
  const [search, setSearch] = useState("");

  // Aggregate sales data
  const report = useMemo(() => {
    const totalSales = payments.reduce(
      (sum: number, p: any) => sum + (p.amount || 0),
      0
    );
    const totalBookings = bookings.length;
    const totalEvents = events.length;
    const totalTickets = bookings.reduce(
      (sum: number, b: any) => sum + (b.ticketsCount || 1),
      0
    );
    const uniqueUsers = new Set(bookings.map((b: any) => b.userId)).size;
    return {
      totalSales,
      totalBookings,
      totalEvents,
      totalTickets,
      uniqueUsers,
    };
  }, [payments, bookings, events]);

  // Filtered payments for table
  const filteredPayments = useMemo(() => {
    if (!search) return payments;
    return payments.filter(
      (p: any) =>
        p.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        p.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.paymentId?.toString().includes(search)
    );
  }, [payments, search]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Sales Report</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-blue-600">
            {paymentsLoading ? "..." : formatCurrency(report.totalSales)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <p className="text-2xl font-bold text-green-600">
            {bookingsLoading ? "..." : report.totalBookings}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Events</p>
          <p className="text-2xl font-bold text-purple-600">
            {eventsLoading ? "..." : report.totalEvents}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Unique Users</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bookingsLoading ? "..." : report.uniqueUsers}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
          <input
            type="text"
            placeholder="Search by user, event, or payment ID..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-4 font-medium text-gray-700">
                  Payment ID
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">
                  User
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">
                  Event
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">
                  Amount
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p: any) => (
                  <tr key={p.paymentId}>
                    <td className="py-2 px-4">#{p.paymentId}</td>
                    <td className="py-2 px-4">
                      {p.user
                        ? `${p.user.firstName} ${p.user.lastName}`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4">{p.event?.title || "N/A"}</td>
                    <td className="py-2 px-4">{formatCurrency(p.amount)}</td>
                    <td className="py-2 px-4">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          p.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
