/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Features/app/store";
import { eventApi } from "../../Features/api/EventApi";
import { useCreateBookMutation } from "../../Features/api/BookingsApi";
import {
  MdCalendarToday,
  MdLocationOn,
  MdAccessTime,
  MdPeople,
  MdStar,
  MdShare,
  MdArrowBack,
  MdAdd,
  MdRemove,
  MdConfirmationNumber,
  MdError,
  MdHome,
  MdRefresh,
  MdEventNote,
} from "react-icons/md";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";

export const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  // API hooks
  const [createBooking] = useCreateBookMutation();

  // Fetch event details
  const {
    data: eventData,
    isLoading,
    error,
  } = eventApi.useGetEventByIdQuery(eventId, {
    skip: !eventId,
  });

  // Format date and time
  const formatDateTime = (eventDate: string, eventTime: string) => {
    const datePart = new Date(eventDate).toISOString().split("T")[0];
    const combined = new Date(`${datePart}T${eventTime}`);
    return {
      date: combined.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: combined.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Handle quantity changes
  const increaseQuantity = () => {
    if (availableTickets > 0 && ticketQuantity < availableTickets) {
      setTicketQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity((prev) => prev - 1);
    }
  };

  // Handle booking
  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book tickets");
      navigate("/login");
      return;
    }

    if (!eventData) {
      toast.error("Event data not available");
      return;
    }

    setIsBooking(true);
    try {
      const totalAmount = parseFloat(eventData.ticketPrice) * ticketQuantity;

      const bookingData = {
        eventId: eventData.eventId,
        userId: user?.userId,
        quantity: ticketQuantity,
        totalAmount,
      };

      const result = await createBooking(bookingData).unwrap();

      console.log("Booking created:", result);
      toast.success(`Successfully booked ${ticketQuantity} ticket(s)!`);

      // Navigate to booking confirmation or user dashboard
      navigate("/dashboard/bookings");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(
        error.data?.message || "Failed to book tickets. Please try again."
      );
    } finally {
      setIsBooking(false);
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: eventData?.eventTitle,
        text: `Check out this event: ${eventData?.eventTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200">
        {/* Loading Header */}
        <div className="bg-base-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="skeleton w-16 h-8 rounded"></div>
              <div className="skeleton w-32 h-4 rounded"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Loading Event Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Loading Event Image */}
              <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
                <div className="skeleton w-full h-96 rounded-xl"></div>
              </div>

              {/* Loading Event Info */}
              <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="skeleton w-3/4 h-8 rounded"></div>
                  <div className="skeleton w-10 h-10 rounded-full"></div>
                </div>

                {/* Loading Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="skeleton w-10 h-10 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="skeleton w-16 h-4 rounded"></div>
                        <div className="skeleton w-24 h-3 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Loading Description */}
                <div className="space-y-3">
                  <div className="skeleton w-48 h-6 rounded"></div>
                  <div className="skeleton w-full h-4 rounded"></div>
                  <div className="skeleton w-full h-4 rounded"></div>
                  <div className="skeleton w-3/4 h-4 rounded"></div>
                </div>
              </div>
            </div>

            {/* Loading Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
                <div className="text-center mb-6 space-y-3">
                  <div className="skeleton w-32 h-6 rounded mx-auto"></div>
                  <div className="skeleton w-24 h-8 rounded mx-auto"></div>
                </div>

                <div className="space-y-4">
                  <div className="skeleton w-full h-12 rounded"></div>
                  <div className="skeleton w-full h-16 rounded"></div>
                  <div className="skeleton w-full h-12 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-8 right-8">
          <div className="bg-primary text-primary-content px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <PuffLoader size={20} color="#ffffff" />
            <span className="text-sm">Loading event...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    // Handle different error types properly
    let errorMessage = "Event not found";
    let errorStatus = 404;

    if (error) {
      if ("status" in error) {
        // FetchBaseQueryError
        errorStatus = typeof error.status === "number" ? error.status : 500;
        if (
          "data" in error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data
        ) {
          errorMessage = (error.data as any).message;
        }
      } else if ("message" in error) {
        // SerializedError
        errorMessage = error.message || "Something went wrong";
        errorStatus = 500;
      }
    }

    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-base-100 rounded-2xl p-8 shadow-lg text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdError className="w-10 h-10 text-error" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-base-content mb-2">
              {errorStatus === 404 ? "Event Not Found" : "Something Went Wrong"}
            </h1>

            {/* Error Message */}
            <p className="text-base-content/70 mb-2">
              {errorStatus === 404
                ? "The event you're looking for doesn't exist or may have been removed."
                : errorMessage}
            </p>

            {/* Error Code */}
            <p className="text-sm text-base-content/50 mb-6">
              Error Code: {errorStatus}
              {eventId && ` | Event ID: ${eventId}`}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/events")}
                className="btn btn-primary w-full"
              >
                <MdEventNote className="w-4 h-4 mr-2" />
                Browse All Events
              </button>

              <button
                onClick={() => navigate("/")}
                className="btn btn-outline w-full"
              >
                <MdHome className="w-4 h-4 mr-2" />
                Go to Homepage
              </button>

              <button
                onClick={() => window.location.reload()}
                className="btn btn-ghost w-full"
              >
                <MdRefresh className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-base-200 rounded-lg">
              <p className="text-sm text-base-content/60">
                <strong>Need help?</strong> If this problem persists, please
                contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dateTime = eventData
    ? formatDateTime(eventData.eventDate, eventData.eventTime)
    : null;
  const totalPrice = eventData
    ? parseFloat(eventData.ticketPrice) * ticketQuantity
    : 0;
  const availableTickets = eventData
    ? (eventData.ticketsTotal || eventData.venue?.venueCapacity || 1000) - (eventData.ticketsSold || 0)
    : 0;

  // Debug logging
  console.log("Event Data:", eventData);
  console.log("Available Tickets:", availableTickets);
  console.log("Ticket Price:", eventData?.ticketPrice);
  console.log("Venue:", eventData?.venue);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
            <MdArrowBack className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <img
                src={eventData.eventImageUrl}
                alt={eventData.eventTitle}
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>

            {/* Event Info */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-base-content">
                  {eventData.eventTitle}
                </h1>
                <button
                  onClick={handleShare}
                  className="btn btn-ghost btn-circle"
                >
                  <MdShare className="w-5 h-5" />
                </button>
              </div>

              {/* Event Meta Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MdCalendarToday className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-base-content/70">
                      {dateTime?.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <MdAccessTime className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-base-content/70">
                      {dateTime?.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <MdLocationOn className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Venue</p>
                    <p className="text-sm text-base-content/70">
                      {eventData?.venue?.venueName || "Event Venue"}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {eventData?.venue?.venueAddress || "Location details will be provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                    <MdPeople className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-sm text-base-content/70">
                      {availableTickets} of {eventData?.ticketsTotal || eventData?.venue?.venueCapacity || "1000"} available
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Category */}
              {eventData?.category && (
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Category:</span>
                    <span className="badge badge-primary badge-sm">
                      {eventData.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Description */}
              <div>
                <h3 className="text-xl font-bold mb-3">About This Event</h3>
                <p className="text-base-content/80 leading-relaxed">
                  {eventData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm sticky top-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MdConfirmationNumber className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Book Tickets</h3>
                </div>
                <div className="text-3xl font-bold text-primary">
                  Ksh {eventData?.ticketPrice || "N/A"}
                  <span className="text-sm font-normal text-base-content/60">
                    {" "}
                    per ticket
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Number of Tickets
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    disabled={ticketQuantity <= 1}
                    className="btn btn-circle btn-outline btn-sm"
                  >
                    <MdRemove className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">
                    {ticketQuantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={ticketQuantity >= availableTickets}
                    className="btn btn-circle btn-outline btn-sm"
                  >
                    <MdAdd className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-center text-base-content/60 mt-2">
                  Limited by available tickets only
                </p>
              </div>

              {/* Price Summary */}
              <div className="border-t border-base-300 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>Tickets ({ticketQuantity}x)</span>
                  <span>Ksh {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    Ksh {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Booking Button */}
              {availableTickets > 0 ? (
                <button
                  onClick={handleBooking}
                  disabled={isBooking || !isAuthenticated}
                  className="btn btn-primary w-full"
                >
                  {isBooking ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Booking...
                    </>
                  ) : !isAuthenticated ? (
                    "Login to Book"
                  ) : (
                    "Book Now"
                  )}
                </button>
              ) : (
                <button disabled className="btn btn-disabled w-full">
                  Sold Out
                </button>
              )}

              {!isAuthenticated && (
                <p className="text-center text-sm text-base-content/60 mt-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="link link-primary"
                  >
                    Sign in
                  </button>{" "}
                  to book tickets
                </p>
              )}

              {/* Event Status */}
              <div className="mt-4 p-3 bg-base-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <MdStar className="w-4 h-4 text-warning" />
                  <span className="font-medium">Event Status:</span>
                  <span className="badge badge-success badge-sm">
                    Available
                  </span>
                </div>
                <p className="text-xs text-base-content/60 mt-1">
                  {eventData?.ticketsSold || 0} tickets sold • {availableTickets}{" "}
                  remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
