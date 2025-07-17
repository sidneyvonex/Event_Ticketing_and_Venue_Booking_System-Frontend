import { useState } from "react";
import { useSelector } from "react-redux";
import { bookingsApi } from "../../Features/api/BookingsApi";
import type { RootState } from "../../Features/app/store";
import type { BookingsDataTypes } from "../../types/types";
import { PuffLoader } from "react-spinners";
import { Link } from "react-router";
import { MdSearch } from "react-icons/md";

// PDF generation function for ticket
const generateTicketPDF = async (booking: BookingsDataTypes) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  try {
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Event Ticket - #${booking.bookingId}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 20px; 
            color: #1f2937;
            line-height: 1.4;
            font-size: 14px;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #6366f1; 
            padding-bottom: 15px; 
            margin-bottom: 20px;
          }
          .company-name { 
            font-size: 22px; 
            font-weight: bold; 
            color: #6366f1; 
            margin-bottom: 3px;
          }
          .ticket-title { 
            font-size: 14px; 
            color: #6b7280; 
          }
          .ticket-info { 
            background: #f8fafc; 
            padding: 15px; 
            border-radius: 6px; 
            margin-bottom: 18px;
            border: 1px solid #e2e8f0;
          }
          .info-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px; 
            padding: 5px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .info-row:last-child { 
            border-bottom: none; 
          }
          .label { 
            font-weight: 600; 
            color: #374151;
            font-size: 13px;
          }
          .value { 
            color: #1f2937;
            font-size: 13px;
          }
          .event-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #6366f1; 
            text-align: center; 
            padding: 15px; 
            background: #f1f5f9; 
            border-radius: 6px; 
            margin: 15px 0;
            border: 1px solid #e2e8f0;
          }
          .qr-section {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            border: 2px dashed #6366f1;
            border-radius: 8px;
          }
          .footer { 
            margin-top: 25px; 
            text-align: center; 
            font-size: 11px; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb; 
            padding-top: 15px;
          }
          .footer p {
            margin: 3px 0;
          }
          @media print {
            body { margin: 15px; font-size: 12px; }
            .event-title { font-size: 18px; }
            .company-name { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">TicKenya</div>
          <div class="ticket-title">Event Ticket</div>
        </div>

        <div class="event-title">
          ${booking.event.eventTitle}
        </div>

        <div class="ticket-info">
          <div class="info-row">
            <span class="label">Ticket #:</span>
            <span class="value">${booking.bookingId
              .toString()
              .padStart(6, "0")}</span>
          </div>
          <div class="info-row">
            <span class="label">Event Date:</span>
            <span class="value">${new Date(
              booking.event.eventDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div class="info-row">
            <span class="label">Event Time:</span>
            <span class="value">${booking.event.eventTime}</span>
          </div>
          <div class="info-row">
            <span class="label">Venue:</span>
            <span class="value">${booking.event.venue.venueName}</span>
          </div>
          <div class="info-row">
            <span class="label">Number of Tickets:</span>
            <span class="value">${booking.quantity}</span>
          </div>
          <div class="info-row">
            <span class="label">Ticket Price:</span>
            <span class="value">KSh ${booking.event.ticketPrice}</span>
          </div>
          <div class="info-row">
            <span class="label">Booking Status:</span>
            <span class="value">${booking.bookingStatus}</span>
          </div>
        </div>

        <div class="qr-section">
          <p style="margin: 0 0 10px 0; font-weight: 600;">Present this ticket at the venue</p>
          <div style="font-size: 48px; margin: 10px 0;">🎫</div>
          <p style="margin: 10px 0 0 0; font-size: 12px;">
            Show booking ID: #${booking.bookingId}
          </p>
        </div>

        <div class="footer">
          <p><strong>Important Information:</strong></p>
          <p>Please arrive 30 minutes before the event starts</p>
          <p>This ticket is non-transferable and must be presented with valid ID</p>
          <p>Generated: ${new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(pdfContent);
    printWindow.document.close();
  } catch (error) {
    console.error("Error generating ticket:", error);
    alert("Failed to generate ticket. Please try again.");
  }
};

export const UserBookings = () => {
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Simplified date formatting - shorter format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format event date and time together
  const formatDateTime = (eventDate: string, eventTime: string) => {
    const datePart = new Date(eventDate).toISOString().split("T")[0];
    const combined = new Date(`${datePart}T${eventTime}`);
    return formatDate(combined.toISOString());
  };

  // Action handlers
  const handleViewTicket = (booking: BookingsDataTypes) => {
    console.log("Viewing ticket for booking:", booking.bookingId);
    generateTicketPDF(booking);
  };

  const handleCancelBooking = (bookingId: number, bookingStatus: string) => {
    console.log("Cancelling booking:", bookingId);

    // Check if booking can be cancelled
    if (bookingStatus?.toLowerCase() === "cancelled") {
      alert("This booking is already cancelled");
      return;
    }

    // Confirm cancellation
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking? This action cannot be undone."
    );

    if (confirmCancel) {
      // TODO: Add API call to cancel booking
      // bookingsApi.useCancelBookingMutation()
      alert(`Booking #${bookingId} has been cancelled`);
    }
  };

  const { user } = useSelector((state: RootState) => state.auth);

  const userId = user?.userId;

  const {
    data: BookingsData = [],
    isLoading,
    error,
  } = bookingsApi.useGetAllBookingsForUserIdQuery(userId, {
    skip: !userId,
  });

  // Filter and search bookings
  const filteredBookings = BookingsData.filter((booking: BookingsDataTypes) => {
    // Status filter
    const matchesStatus =
      statusFilter === "All" ||
      booking.bookingStatus?.toLowerCase() === statusFilter.toLowerCase();

    // Search filter - search in event title, venue name, and booking ID
    const matchesSearch =
      searchTerm === "" ||
      booking.event.eventTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.event.venue.venueName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toString().includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  // Get unique statuses for filter dropdown
  const availableStatuses: string[] = [
    "All",
    ...Array.from(
      new Set(
        BookingsData.map((booking: BookingsDataTypes) => booking.bookingStatus)
      )
    ).filter((status): status is string => typeof status === "string"),
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">My Bookings</h2>

      {/* Search and Filter Section */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by event, venue, or booking ID..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          className="select select-bordered w-full sm:w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Results Summary */}
      {(searchTerm || statusFilter !== "All") && (
        <div className="mb-4 text-sm text-base-content/70">
          Showing {filteredBookings.length} of {BookingsData.length} bookings
          {searchTerm && ` for "${searchTerm}"`}
          {statusFilter !== "All" && ` with status "${statusFilter}"`}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-48 bg-base-100 rounded-2xl border border-base-300">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <PuffLoader size={60} color="#0f172a" />
            </div>
            <p className="text-sm">Loading your bookings...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-md">
          <table className="table w-full">
            {/* Table Head */}
            <thead className="bg-base-200 text-base-content border-b border-base-300">
              <tr>
                <th>#</th>
                <th>Event</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Tickets</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-base-200">
              {error || !BookingsData || BookingsData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="text-base-content/70">
                      <div className="text-4xl mb-2">🎫</div>
                      <p className="font-semibold text-xl">No bookings found</p>
                      <p className="text-sm">
                        You haven't made any bookings yet.
                      </p>
                      <Link
                        to="/dashboard/events"
                        className="btn btn-xs btn-outline mt-3 inline-block"
                      >
                        Browse Events
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="text-base-content/70">
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="font-semibold text-xl">
                        No matching bookings
                      </p>
                      <p className="text-sm">
                        No bookings match your current search or filter.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("All");
                        }}
                        className="btn btn-xs btn-outline mt-3"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking: BookingsDataTypes) => (
                  <tr key={booking.bookingId} className="hover:bg-base-50">
                    <td className="font-mono">#{booking.bookingId}</td>
                    <td className="font-semibold">
                      {booking.event.eventTitle}
                    </td>
                    <td>
                      {formatDateTime(
                        booking.event.eventDate,
                        booking.event.eventTime
                      )}
                    </td>
                    <td>{booking.event.venue.venueName}</td>
                    <td className="text-center">{booking.quantity}</td>
                    <td className="font-semibold">
                      KSh {booking.event.ticketPrice}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          booking.bookingStatus?.toLowerCase() === "confirmed"
                            ? "badge-success"
                            : booking.bookingStatus?.toLowerCase() === "pending"
                            ? "badge-warning"
                            : booking.bookingStatus?.toLowerCase() ===
                              "cancelled"
                            ? "badge-error"
                            : "badge-info"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td>
                      <div className="flex flex-col gap-1">
                        {/* View Ticket - Only for confirmed bookings */}
                        {booking.bookingStatus?.toLowerCase() ===
                          "confirmed" && (
                          <button
                            className="btn btn-xs btn-outline"
                            onClick={() => handleViewTicket(booking)}
                            title="View your ticket"
                          >
                            View
                          </button>
                        )}

                        {/* Cancel Booking - Only for confirmed/pending bookings */}
                        {(booking.bookingStatus?.toLowerCase() ===
                          "confirmed" ||
                          booking.bookingStatus?.toLowerCase() ===
                            "pending") && (
                          <button
                            className="btn btn-xs btn-outline"
                            onClick={() =>
                              handleCancelBooking(
                                booking.bookingId,
                                booking.bookingStatus
                              )
                            }
                            title="Cancel this booking"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Already Cancelled */}
                        {booking.bookingStatus?.toLowerCase() ===
                          "cancelled" && (
                          <div className="text-xs text-gray-500 italic">
                            Cancelled
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
