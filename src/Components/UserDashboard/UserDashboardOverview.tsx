/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { Link } from "react-router";
import type { RootState } from "../../Features/app/store";
import { bookingsApi } from "../../Features/api/BookingsApi";
import { eventApi } from "../../Features/api/EventApi";
import { paymentsApi } from "../../Features/api/PaymentsApi";
import type { BookingsDataTypes, EventsDataTypes } from "../../types/types";
import { PuffLoader } from "react-spinners";
import {
  MdCalendarToday,
  MdEvent,
  MdBookmark,
  MdPayment,
  MdTrendingUp,
  MdAccessTime,
  MdLocationOn,
  MdSearch,
  MdAccountCircle,
} from "react-icons/md";

export const UserDashboardOverview = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // Use FullName and  fallback to user
  const userName = user?.fullName || "user"

  // Fetch user bookings
  const { data: userBookings = [], isLoading: bookingsLoading } =
    bookingsApi.useGetAllBookingsForUserIdQuery(userId, {
      skip: !userId,
    });

  // Fetch all events for upcoming events
  const { data: allEvents = [], isLoading: eventsLoading } =
    eventApi.useGetAllEventsQuery({});

  // Fetch user payments/transactions
  const { data: userPayments = [], isLoading: paymentsLoading } =
    paymentsApi.useGetAllPaymentsForUserIdQuery(userId, {
      skip: !userId,
    });

  // Get current date info
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get upcoming events (next 3 events)
  const getUpcomingEvents = () => {
    const now = new Date();
    return allEvents
      .filter((event: EventsDataTypes) => new Date(event.eventDate) > now)
      .sort(
        (a: EventsDataTypes, b: EventsDataTypes) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      )
      .slice(0, 3);
  };

  // Get recent bookings (last 3)
  const getRecentBookings = () => {
    return userBookings
      .slice()
      .sort(
        (a: BookingsDataTypes, b: BookingsDataTypes) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 3);
  };

  // Get recent transactions (last 3)
  const getRecentTransactions = () => {
    return userPayments
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 3);
  };

  // Calculate stats
  const totalBookings = userBookings.length;
  const confirmedBookings = userBookings.filter(
    (booking: BookingsDataTypes) =>
      booking.bookingStatus?.toLowerCase() === "confirmed"
  ).length;
  const upcomingEvents = getUpcomingEvents();
  const recentBookings = getRecentBookings();
  const recentTransactions = getRecentTransactions();

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "badge badge-success";
      case "Pending":
        return "badge badge-warning";
      case "Failed":
        return "badge badge-error";
      case "Refunded":
        return "badge badge-info";
      default:
        return "badge badge-ghost";
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl p-6 shadow-lg">
        <div className="flex items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-primary-content/90 text-lg mb-3">
              Ready to discover amazing events? Let's get started!
            </p>
            <div className="flex items-center text-primary-content/80">
              <MdCalendarToday className="w-5 h-5 mr-2" />
              <span className="text-base font-medium">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Bookings */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-primary">{totalBookings}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-xl">
              <MdBookmark className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Confirmed Bookings
              </p>
              <p className="text-3xl font-bold text-success">
                {confirmedBookings}
              </p>
            </div>
            <div className="bg-success/10 p-3 rounded-xl">
              <MdTrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>


        {/* Available Events */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">
                Events Booked
              </p>
              <p className="text-3xl font-bold text-warning">
                {upcomingEvents.length}
              </p>
            </div>
            <div className="bg-warning/10 p-3 rounded-xl">
              <MdEvent className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings Table */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-base-content">
              <MdBookmark className="inline mr-2" />
              Recent Bookings
            </h2>
            <Link to="/dashboard/bookings" className="btn btn-sm btn-outline">
              View All
            </Link>
          </div>

          {bookingsLoading ? (
            <div className="flex justify-center py-8">
              <PuffLoader size={40} color="#6366f1" />
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <MdBookmark className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No bookings yet</p>
              <Link
                to="/dashboard/events"
                className="btn btn-sm btn-primary mt-2"
              >
                Book Your First Event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking: BookingsDataTypes) => (
                    <tr key={booking.bookingId} className="hover">
                      <td>
                        <div className="font-bold truncate max-w-[150px]">
                          {booking.event.eventTitle}
                        </div>
                        <div className="text-sm opacity-50">
                          Booking #{booking.bookingId}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {formatDate(booking.event.eventDate)}
                        </div>
                        <div className="text-xs opacity-50">
                          {formatTime(booking.event.eventTime)}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            booking.bookingStatus?.toLowerCase() === "confirmed"
                              ? "badge-success"
                              : booking.bookingStatus?.toLowerCase() ===
                                "pending"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </td>
                      <td>{booking.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-base-content">
              <MdPayment className="inline mr-2" />
              Recent Transactions
            </h2>
            <Link to="/dashboard/payments" className="btn btn-sm btn-outline">
              View All
            </Link>
          </div>

          {paymentsLoading ? (
            <div className="flex justify-center py-8">
              <PuffLoader size={40} color="#6366f1" />
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <MdPayment className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction: any) => (
                    <tr key={transaction.paymentId} className="hover">
                      <td>
                        <div className="font-mono text-sm">
                          {transaction.transactionId ||
                            `TXN-${transaction.paymentId}`}
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-primary">
                          KSh {Number(transaction.amount || 0).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge-sm ${getStatusBadge(
                            transaction.paymentStatus
                          )}`}
                        >
                          {transaction.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm">
                          {formatDate(
                            transaction.createdAt || new Date().toISOString()
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-base-content">
            <MdEvent className="inline mr-2" />
            Upcoming Events
          </h2>
          <Link to="/dashboard/events" className="btn btn-sm btn-outline">
            View All
          </Link>
        </div>

        {eventsLoading ? (
          <div className="flex justify-center py-8">
            <PuffLoader size={40} color="#6366f1" />
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            <MdEvent className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event: EventsDataTypes) => (
              <div
                key={event.eventId}
                className="card bg-base-50 border border-base-300"
              >
                <div className="card-body p-4">
                  <h3 className="card-title text-base">{event.eventTitle}</h3>
                  <div className="flex items-center text-sm text-base-content/60 mt-1">
                    <MdAccessTime className="w-4 h-4 mr-1" />
                    {formatDate(event.eventDate)} at{" "}
                    {formatTime(event.eventTime)}
                  </div>
                  <div className="flex items-center text-sm text-base-content/60 mt-1">
                    <MdLocationOn className="w-4 h-4 mr-1" />
                    {event.venue?.venueName || "Venue TBA"}
                  </div>
                  <div className="card-actions justify-between items-center mt-3">
                    <span className="text-lg font-bold text-primary">
                      KSh {event.ticketPrice}
                    </span>
                    <Link
                      to={`/dashboard/events/${event.eventId}`}
                      className="btn btn-primary btn-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
        <h2 className="text-xl font-bold text-base-content mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/dashboard/events"
            className="flex flex-col items-center p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors group"
          >
            <MdSearch className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-base-content text-center">
              Browse Events
            </span>
          </Link>

          <Link
            to="/dashboard/bookings"
            className="flex flex-col items-center p-4 bg-info/5 hover:bg-info/10 rounded-xl transition-colors group"
          >
            <MdBookmark className="w-8 h-8 text-info mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-base-content text-center">
              My Bookings
            </span>
          </Link>

          <Link
            to="/dashboard/payments"
            className="flex flex-col items-center p-4 bg-success/5 hover:bg-success/10 rounded-xl transition-colors group"
          >
            <MdPayment className="w-8 h-8 text-success mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-base-content text-center">
              Payments
            </span>
          </Link>

          <Link
            to="/dashboard/profile"
            className="flex flex-col items-center p-4 bg-warning/5 hover:bg-warning/10 rounded-xl transition-colors group"
          >
            <MdAccountCircle className="w-8 h-8 text-warning mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-base-content text-center">
              My Profile
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
