/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  X,
  User,
  Mail,
  CreditCard,
  Save,
} from "lucide-react";
import {
  useGetAllBooksQuery,
  useUpdateBookingsMutation,
  useDeleteBookingsMutation,
} from "../../Features/api/BookingsApi";
import { eventApi } from "../../Features/api/EventApi";
import { toast, Toaster } from "sonner";
import type { BookingsDataTypes } from "../../types/types";

export const AllBookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingsDataTypes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    bookingStatus: "",
    quantity: 0,
    eventId: 0,
  });

  // Fetch data
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useGetAllBooksQuery({});
  const { data: events = [] } = eventApi.useGetAllEventsQuery({});

  // Mutations
  const [updateBooking, { isLoading: isUpdating }] =
    useUpdateBookingsMutation();
  const [deleteBooking, { isLoading: isDeleting }] =
    useDeleteBookingsMutation();

  // Enhanced bookings with event and user data
  const enhancedBookings = useMemo(() => {
    return bookings.map((booking: BookingsDataTypes) => {
      const event = events.find((e: any) => e.eventId === booking.eventId);
      return {
        ...booking,
        event: event
          ? {
              eventTitle: event.eventTitle || "Unknown Event",
              eventDate: event.eventDate || "",
              venue: {
                venueName:
                  typeof event.venue === "object"
                    ? event.venue?.venueName
                    : event.venue || "Unknown Venue",
              },
            }
          : null,
      };
    });
  }, [bookings, events]);

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    let filtered = enhancedBookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking: BookingsDataTypes) =>
          booking.event?.eventTitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.user?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.user?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${booking.user?.firstName || ""} ${booking.user?.lastName || ""}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.bookingId.toString().includes(searchTerm) ||
          booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (booking: BookingsDataTypes) => booking.bookingStatus === statusFilter
      );
    }

    // Sort
    filtered.sort((a: BookingsDataTypes, b: BookingsDataTypes) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "amount-high":
          return parseFloat(b.totalAmount) - parseFloat(a.totalAmount);
        case "amount-low":
          return parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
        default:
          return 0;
      }
    });

    return filtered;
  }, [enhancedBookings, searchTerm, statusFilter, sortBy]);

  // Pagination
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Status counts for summary
  const statusCounts = useMemo(() => {
    const counts = enhancedBookings.reduce(
      (acc: Record<string, number>, booking: BookingsDataTypes) => {
        const status = booking.bookingStatus || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );
    return counts;
  }, [enhancedBookings]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <CheckCircle size={12} />
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            <Clock size={12} />
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            <XCircle size={12} />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    return `Ksh ${parseFloat(amount || "0").toLocaleString()}`;
  };

  const openModal = (booking: BookingsDataTypes) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const openEditModal = (booking: BookingsDataTypes) => {
    setSelectedBooking(booking);
    setEditFormData({
      bookingStatus: booking.bookingStatus,
      quantity: booking.quantity,
      eventId: booking.eventId,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedBooking(null);
    setIsEditModalOpen(false);
    setEditFormData({
      bookingStatus: "",
      quantity: 0,
      eventId: 0,
    });
  };

  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    try {
      // Calculate new total amount based on quantity change
      const selectedEvent = events.find(
        (e: any) => e.eventId === editFormData.eventId
      );
      const pricePerTicket =
        selectedEvent?.ticketPrice ||
        parseFloat(selectedBooking.totalAmount) / selectedBooking.quantity;
      const newTotalAmount = (
        editFormData.quantity * pricePerTicket
      ).toString();

      console.log("Updating booking with ID:", selectedBooking.bookingId);
      console.log("Update payload:", {
        bookingId: selectedBooking.bookingId,
        bookingStatus: editFormData.bookingStatus,
        quantity: editFormData.quantity,
        eventId: editFormData.eventId,
        totalAmount: newTotalAmount,
      });

      await updateBooking({
        bookingId: selectedBooking.bookingId,
        bookingStatus: editFormData.bookingStatus,
        quantity: editFormData.quantity,
        eventId: editFormData.eventId,
        totalAmount: newTotalAmount,
      }).unwrap();

      toast.success("Booking updated successfully!", {
        position: "top-right",
      });

      closeEditModal();
      // Don't call refetchBookings() as RTK Query auto-updates due to invalidatesTags
    } catch (error: any) {
      console.error("Update booking error:", error);

      // Handle HTML error responses (backend routing issues)
      if (
        error?.status === "PARSING_ERROR" &&
        error?.data?.includes("<!DOCTYPE")
      ) {
        toast.error(
          "Backend routing error: PUT endpoint not found. Please check backend server.",
          {
            position: "top-right",
            duration: 6000,
          }
        );
        console.error(
          "Backend appears to be returning HTML instead of JSON. Check if PUT /api/bookings/{id} route exists."
        );
        return;
      }

      // Handle different types of errors
      if (error?.status === 400) {
        toast.error("Invalid booking data. Please check your inputs.", {
          position: "top-right",
          duration: 4000,
        });
      } else if (error?.status === 404) {
        toast.error(
          "Booking not found. It may have been deleted by another user.",
          {
            position: "top-right",
            duration: 4000,
          }
        );
        // Close modal since booking doesn't exist
        closeEditModal();
      } else if (error?.originalStatus === 404) {
        toast.error(
          "Backend endpoint not found. PUT /api/bookings/{id} route may be missing.",
          {
            position: "top-right",
            duration: 6000,
          }
        );
      } else {
        toast.error("Failed to update booking. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      console.log("Deleting booking with ID:", bookingId);

      await deleteBooking(bookingId).unwrap();

      toast.success("Booking deleted successfully!", {
        position: "top-right",
      });

      // Don't call refetchBookings() as RTK Query auto-updates due to invalidatesTags
    } catch (error: any) {
      console.error("Delete booking error:", error);

      // Handle HTML error responses (backend routing issues)
      if (
        error?.status === "PARSING_ERROR" &&
        error?.data?.includes("<!DOCTYPE")
      ) {
        toast.error(
          "Backend routing error: DELETE endpoint not found. Please check backend server.",
          {
            position: "top-right",
            duration: 6000,
          }
        );
        console.error(
          "Backend appears to be returning HTML instead of JSON. Check if DELETE /api/bookings/{id} route exists."
        );
        return;
      }

      // Handle different types of errors
      if (error?.status === 400) {
        toast.error("Invalid booking ID.", {
          position: "top-right",
          duration: 4000,
        });
      } else if (error?.status === 404) {
        toast.error(
          "Booking not found. It may have already been deleted by another user.",
          {
            position: "top-right",
            duration: 4000,
          }
        );
        // Force refresh the bookings list to reflect current state
        setTimeout(() => window.location.reload(), 2000);
      } else if (error?.originalStatus === 404) {
        toast.error(
          "Backend endpoint not found. DELETE /api/bookings/{id} route may be missing.",
          {
            position: "top-right",
            duration: 6000,
          }
        );
      } else {
        toast.error("Failed to delete booking. Please try again.", {
          position: "top-right",
        });
      }
    }
  };

  if (bookingsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle size={20} />
            <span className="font-medium">Error loading bookings</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            Failed to fetch booking data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all platform bookings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">
                {enhancedBookings.length}
              </p>
            </div>
            <Calendar className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {statusCounts.Confirmed || 0}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {statusCounts.Pending || 0}
              </p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  enhancedBookings
                    .reduce(
                      (sum: number, booking: BookingsDataTypes) =>
                        sum + parseFloat(booking.totalAmount || "0"),
                      0
                    )
                    .toString()
                )}
              </p>
            </div>
            <DollarSign className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by booking ID, event, or customer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount (High to Low)</option>
              <option value="amount-low">Amount (Low to High)</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Booking ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Event
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Amount
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBookings.map((booking: BookingsDataTypes) => (
                <tr key={booking.bookingId} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-medium text-blue-600">
                      #{booking.bookingId}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.event?.eventTitle || "Unknown Event"}
                      </p>
                      {booking.event?.venue.venueName && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin size={12} />
                          {booking.event.venue.venueName}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.user?.firstName && booking.user?.lastName
                          ? `${booking.user.firstName} ${booking.user.lastName}`
                          : booking.user?.firstName ||
                            booking.user?.lastName ||
                            `User ${booking.userId}`}
                      </p>
                      {booking.user?.email && (
                        <p className="text-sm text-gray-600">
                          {booking.user.email}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{booking.quantity}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(booking.bookingStatus)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-600">
                      {formatDate(booking.createdAt)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(booking)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(booking)}
                        className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                        title="Edit Booking"
                        disabled={isUpdating}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.bookingId)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Booking"
                        disabled={isDeleting}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {paginatedBookings.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
              <h3 className="text-lg font-medium mb-2">No bookings found</h3>
              <p>
                {searchTerm || statusFilter !== "All"
                  ? "Try adjusting your search or filter criteria."
                  : "No bookings have been made yet."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginatedBookings.map((booking: BookingsDataTypes) => (
                <div
                  key={booking.bookingId}
                  className="rounded-xl bg-white border border-gray-200 shadow-sm p-4 flex flex-col gap-2 max-w-full overflow-x-auto"
                  style={{ wordBreak: "break-word" }}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-blue-600 font-bold text-base">
                      #{booking.bookingId}
                    </span>
                    {getStatusBadge(booking.bookingStatus)}
                  </div>

                  {/* Event Info */}
                  <div className="mb-2">
                    <div className="font-semibold text-gray-900 text-base truncate">
                      {booking.event?.eventTitle || "Unknown Event"}
                    </div>
                    {booking.event?.venue.venueName && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span className="truncate">
                          {booking.event.venue.venueName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Customer
                    </div>
                    <div className="font-medium text-gray-800 truncate">
                      {booking.user?.firstName && booking.user?.lastName
                        ? `${booking.user.firstName} ${booking.user.lastName}`
                        : booking.user?.firstName ||
                          booking.user?.lastName ||
                          `User ${booking.userId}`}
                    </div>
                    {booking.user?.email && (
                      <div className="text-xs text-gray-500 truncate">
                        {booking.user.email}
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-2 text-sm">
                    <div>
                      <span className="block text-xs text-gray-500">Qty</span>
                      <span className="font-semibold text-gray-900">
                        {booking.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">
                        Amount
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Date</span>
                      <span className="text-gray-700">
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">
                        Status
                      </span>
                      <span>{getStatusBadge(booking.bookingStatus)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => openModal(booking)}
                      className="flex-1 min-w-[100px] px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 transition"
                      title="View Details"
                    >
                      <Eye size={14} className="inline mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(booking)}
                      className="flex-1 min-w-[100px] px-3 py-2 text-xs bg-green-50 text-green-700 rounded-lg border border-green-100 hover:bg-green-100 transition"
                      title="Edit Booking"
                      disabled={isUpdating}
                    >
                      <Edit3 size={14} className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking.bookingId)}
                      className="flex-1 min-w-[100px] px-3 py-2 text-xs bg-red-50 text-red-700 rounded-lg border border-red-100 hover:bg-red-100 transition"
                      title="Delete Booking"
                      disabled={isDeleting}
                    >
                      <Trash2 size={14} className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                {totalItems} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && !bookingsLoading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "All"
              ? "Try adjusting your search or filter criteria."
              : "No bookings have been made yet."}
          </p>
        </div>
      )}

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[95vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Booking Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Booking Overview */}
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                    <h3 className="text-base sm:text-lg font-medium text-blue-900">
                      Booking #{selectedBooking.bookingId}
                    </h3>
                    {getStatusBadge(selectedBooking.bookingStatus)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">
                        Total Amount:
                      </span>
                      <p className="text-blue-900 font-semibold text-base sm:text-lg">
                        {formatCurrency(selectedBooking.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">
                        Quantity:
                      </span>
                      <p className="text-blue-900 font-semibold text-base sm:text-lg">
                        {selectedBooking.quantity} tickets
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="text-purple-600" size={18} />
                    Event Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium text-sm">
                        Event Title:
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {selectedBooking.event?.eventTitle || "Unknown Event"}
                      </p>
                    </div>
                    {selectedBooking.event?.eventDate && (
                      <div>
                        <span className="text-gray-600 font-medium text-sm">
                          Event Date:
                        </span>
                        <p className="text-gray-900">
                          {formatDate(selectedBooking.event.eventDate)}
                        </p>
                      </div>
                    )}
                    {selectedBooking.event?.venue.venueName && (
                      <div>
                        <span className="text-gray-600 font-medium text-sm">
                          Venue:
                        </span>
                        <p className="text-gray-900 flex items-start gap-1">
                          <MapPin
                            size={16}
                            className="text-red-500 mt-0.5 shrink-0"
                          />
                          <span className="break-words">
                            {selectedBooking.event.venue.venueName}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2">
                    <CreditCard className="text-green-600" size={18} />
                    Payment Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <span className="text-gray-600 font-medium text-sm">
                          Amount per Ticket:
                        </span>
                        <p className="text-gray-900 font-semibold">
                          {formatCurrency(
                            (
                              parseFloat(selectedBooking.totalAmount) /
                              selectedBooking.quantity
                            ).toString()
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium text-sm">
                          Total Paid:
                        </span>
                        <p className="text-green-600 font-semibold">
                          {formatCurrency(selectedBooking.totalAmount)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium text-sm">
                        Payment Status:
                      </span>
                      <p className="text-gray-900">
                        {selectedBooking.bookingStatus === "Confirmed"
                          ? "Paid"
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2">
                    <User className="text-green-600" size={18} />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium text-sm">
                        Customer Name:
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {selectedBooking.user?.firstName &&
                        selectedBooking.user?.lastName
                          ? `${selectedBooking.user.firstName} ${selectedBooking.user.lastName}`
                          : selectedBooking.user?.firstName ||
                            selectedBooking.user?.lastName ||
                            `User ${selectedBooking.userId}`}
                      </p>
                    </div>
                    {selectedBooking.user?.email && (
                      <div>
                        <span className="text-gray-600 font-medium text-sm">
                          Email:
                        </span>
                        <p className="text-gray-900 flex items-start gap-1">
                          <Mail
                            size={16}
                            className="text-blue-500 mt-0.5 shrink-0"
                          />
                          <span className="break-all">
                            {selectedBooking.user.email}
                          </span>
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600 font-medium text-sm">
                        User ID:
                      </span>
                      <p className="text-gray-900">#{selectedBooking.userId}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Timeline */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Clock className="text-orange-600" size={18} />
                    Booking Timeline
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium text-sm">
                        Created At:
                      </span>
                      <p className="text-gray-900">
                        {formatDate(selectedBooking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 shrink-0">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-3 sm:order-1"
              >
                Close
              </button>
              <button
                onClick={() => openEditModal(selectedBooking)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
              >
                Edit Booking
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors order-2 sm:order-3">
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {isEditModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl md:max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Edit Booking #{selectedBooking.bookingId}
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                disabled={isUpdating}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-6">
                {/* Customer Info (Read-only) */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Customer Information (Read-only)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Customer Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.user?.firstName &&
                        selectedBooking.user?.lastName
                          ? `${selectedBooking.user.firstName} ${selectedBooking.user.lastName}`
                          : `User ${selectedBooking.userId}`}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.user?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-4">
                  {/* Booking Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Status
                    </label>
                    <div className="relative">
                      <select
                        value={editFormData.bookingStatus}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            bookingStatus: e.target.value,
                          })
                        }
                        className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUpdating}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  </div>

                  {/* Event Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event
                    </label>
                    <div className="relative">
                      <select
                        value={editFormData.eventId}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            eventId: parseInt(e.target.value),
                          })
                        }
                        className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUpdating}
                      >
                        {events.map((event: any) => (
                          <option key={event.eventId} value={event.eventId}>
                            {event.eventTitle} -{" "}
                            {event.venue?.venueName || event.venue}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editFormData.quantity}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isUpdating}
                    />
                  </div>

                  {/* Current Total (Read-only preview) */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Price Preview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Original Total:</span>
                        <p className="font-semibold text-blue-900">
                          {formatCurrency(selectedBooking.totalAmount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700">
                          New Total (estimated):
                        </span>
                        <p className="font-semibold text-blue-900">
                          {(() => {
                            const selectedEvent = events.find(
                              (e: any) => e.eventId === editFormData.eventId
                            );
                            const pricePerTicket =
                              selectedEvent?.ticketPrice ||
                              parseFloat(selectedBooking.totalAmount) /
                                selectedBooking.quantity;
                            return formatCurrency(
                              (
                                editFormData.quantity * pricePerTicket
                              ).toString()
                            );
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 shrink-0">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 order-1 sm:order-2"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toaster for notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
};
