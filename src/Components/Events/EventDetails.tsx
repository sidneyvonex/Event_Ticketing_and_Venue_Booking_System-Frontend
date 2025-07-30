"use client";

import type React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Features/app/store";
import { eventApi } from "../../Features/api/EventApi";
import { useBookAndPayMpesaMutation } from "../../Features/api/BookingsApi";
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
  MdEventNote,
  MdPhone,
  MdPayment,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { PuffLoader } from "react-spinners";
import { toast, Toaster } from "sonner";

interface PaymentStatus {
  status: "pending" | "completed" | "failed" | "cancelled";
  message: string;
  checkoutRequestID?: string;
  bookingId?: number;
}

export const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(
    null
  );

  // RTK Query hooks
  const [bookAndPayMpesa, { isLoading: isBooking }] =
    useBookAndPayMpesaMutation();

  // Fetch event details
  const {
    data: eventData,
    isLoading,
    error,
  } = eventApi.useGetEventByIdQuery(eventId, {
    skip: !eventId,
  });

  // Poll payment status when we have a checkout request ID
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (checkoutRequestID && paymentStatus?.status === "pending") {
      interval = setInterval(async () => {
        try {
          // Use window._env_ or a hardcoded fallback, since process.env is not available in the browser at runtime
          const backendUrl =
            (window as any)._env_?.REACT_APP_BACKEND_URL ||
            "https://eventsbookingmanagement.azurewebsites.net";

          const response = await fetch(
            `${backendUrl}/api/payment-status?checkoutRequestID=${checkoutRequestID}`,
          );
          const data = await response.json();

          if (
            data.paymentStatus &&
            data.paymentStatus.toLowerCase() === "completed"
          ) {
            setPaymentStatus({
              status: "completed",
              message: "Payment successful! Your booking is confirmed.",
              checkoutRequestID,
              bookingId: data.bookingId,
            });
            toast.success("Payment successful! Your booking is confirmed.");
            clearInterval(interval);

            setTimeout(() => {
              navigate("/dashboard/bookings");
            }, 2000);
          } else if (
            data.paymentStatus &&
            data.paymentStatus.toLowerCase() === "failed"
          ) {
            setPaymentStatus({
              status: "failed",
              message: "Payment failed. Please try again.",
              checkoutRequestID,
            });
            toast.error("Payment failed. Please try again.");
            clearInterval(interval);
          }
        } catch (error) {
          // Optionally show a toast for polling errors
          // toast.error("Error checking payment status. Please refresh.");
          console.error("Error checking payment status:", error);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkoutRequestID, paymentStatus?.status, navigate]);

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

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // If starts with 0, replace with 254
    if (digits.startsWith("0")) {
      return "254" + digits.slice(1);
    }

    // If starts with +254, remove the +
    if (digits.startsWith("254")) {
      return digits;
    }

    // If starts with 7, 1, add 254
    if (digits.startsWith("7") || digits.startsWith("1")) {
      return "254" + digits;
    }

    return digits;
  };

  // Handle phone number input
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
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

  // Handle M-Pesa booking using RTK Query
  const handleMpesaBooking = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book tickets");
      navigate("/login");
      return;
    }

    if (!eventData) {
      toast.error("Event data not available");
      return;
    }

    if (availableTickets <= 0) {
      toast.error("No tickets available for this event");
      return;
    }

    if (ticketQuantity <= 0) {
      toast.error("Please select at least one ticket");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 12) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!phoneNumber.startsWith("254")) {
      toast.error("Phone number must be in format 254XXXXXXXXX");
      return;
    }

    setPaymentStatus(null);

    const totalAmount =
      Number.parseFloat(eventData.ticketPrice) * ticketQuantity;

    const bookingData = {
      userId: Number(user?.userId),
      eventId: Number(eventData.eventId),
      quantity: Number(ticketQuantity),
      phoneNumber: phoneNumber,
      totalAmount,
    };

    try {
      const result = await bookAndPayMpesa(bookingData).unwrap();

      if (result.success && result.checkoutRequestID) {
        setCheckoutRequestID(result.checkoutRequestID);
        setPaymentStatus({
          status: "pending",
          message: "Payment initiated. Please complete payment on your phone.",
          checkoutRequestID: result.checkoutRequestID,
          bookingId: result.bookingId,
        });

        toast.success(
          "Payment initiated! Please check your phone to complete the payment."
        );
      } else {
        throw new Error(result.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      let errorMessage = "Failed to initiate payment. Please try again.";

      // Handle RTK Query error format
      if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setPaymentStatus({
        status: "failed",
        message: errorMessage,
      });

      toast.error(errorMessage);
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

  // Reset payment status
  const resetPaymentStatus = () => {
    setPaymentStatus(null);
    setCheckoutRequestID(null);
    setPhoneNumber("");
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
        {/* Loading Header */}
        <div
          style={{
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "64px",
                  height: "32px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                }}
              ></div>
              <div
                style={{
                  width: "128px",
                  height: "16px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>
        </div>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <PuffLoader size={60} color="#3b82f6" />
                <p style={{ marginTop: "16px", color: "#6b7280" }}>
                  Loading event details...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !eventData) {
    let errorMessage = "Event not found";
    let errorStatus = 404;
    if (error) {
      if ("status" in error) {
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
        errorMessage = error.message || "Something went wrong";
        errorStatus = 500;
      }
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "448px", width: "100%", margin: "0 16px" }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#fee2e2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <MdError
                style={{ width: "40px", height: "40px", color: "#dc2626" }}
              />
            </div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              {errorStatus === 404 ? "Event Not Found" : "Something Went Wrong"}
            </h1>
            <p style={{ color: "#6b7280", marginBottom: "8px" }}>
              {errorStatus === 404
                ? "The event you're looking for doesn't exist or may have been removed."
                : errorMessage}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                marginBottom: "24px",
              }}
            >
              Error Code: {errorStatus}
              {eventId && ` | Event ID: ${eventId}`}
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <button
                onClick={() => navigate("/events")}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <MdEventNote style={{ width: "16px", height: "16px" }} />
                Browse All Events
              </button>
              <button
                onClick={() => navigate("/")}
                style={{
                  backgroundColor: "transparent",
                  color: "#3b82f6",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "1px solid #3b82f6",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <MdHome style={{ width: "16px", height: "16px" }} />
                Go to Homepage
              </button>
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
    ? Number.parseFloat(eventData.ticketPrice) * ticketQuantity
    : 0;
  const availableTickets = eventData
    ? (eventData.ticketsTotal || eventData.venue?.venueCapacity || 1000) -
      (eventData.ticketsSold || 0)
    : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Toaster position="top-right" richColors />
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#374151",
            }}
          >
            <MdArrowBack style={{ width: "20px", height: "20px" }} />
            Back
          </button>
        </div>
      </div>

      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {/* Event Details */}
          <div style={{ gridColumn: "span 2" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Event Image */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={
                    eventData.eventImageUrl ||
                    "/placeholder.svg?height=384&width=800&query=event"
                  }
                  alt={eventData.eventTitle}
                  style={{
                    width: "100%",
                    height: "384px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>

              {/* Event Info */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {eventData.eventTitle}
                  </h1>
                  <button
                    onClick={handleShare}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: "8px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      color: "#6b7280",
                    }}
                  >
                    <MdShare style={{ width: "20px", height: "20px" }} />
                  </button>
                </div>

                {/* Event Meta Info */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#dbeafe",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MdCalendarToday
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#3b82f6",
                        }}
                      />
                    </div>
                    <div>
                      <p style={{ fontWeight: "500", margin: 0 }}>Date</p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        {dateTime?.date}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#fef3c7",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MdAccessTime
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#f59e0b",
                        }}
                      />
                    </div>
                    <div>
                      <p style={{ fontWeight: "500", margin: 0 }}>Time</p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        {dateTime?.time}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#d1fae5",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MdLocationOn
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#10b981",
                        }}
                      />
                    </div>
                    <div>
                      <p style={{ fontWeight: "500", margin: 0 }}>Venue</p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        {eventData?.venue?.venueName || "Event Venue"}
                      </p>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                          margin: 0,
                        }}
                      >
                        {eventData?.venue?.venueAddress ||
                          "Location details will be provided"}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#e0e7ff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MdPeople
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#6366f1",
                        }}
                      />
                    </div>
                    <div>
                      <p style={{ fontWeight: "500", margin: 0 }}>Capacity</p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        {availableTickets} of{" "}
                        {eventData?.ticketsTotal ||
                          eventData?.venue?.venueCapacity ||
                          "1000"}{" "}
                        available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Category */}
                {eventData?.category && (
                  <div style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>
                        Category:
                      </span>
                      <span
                        style={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      >
                        {eventData.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Event Description */}
                <div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      marginBottom: "12px",
                    }}
                  >
                    About This Event
                  </h3>
                  <p style={{ color: "#4b5563", lineHeight: "1.6", margin: 0 }}>
                    {eventData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                position: "sticky",
                top: "32px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <MdConfirmationNumber
                    style={{ width: "24px", height: "24px", color: "#3b82f6" }}
                  />
                  <h3
                    style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}
                  >
                    Book Tickets
                  </h3>
                </div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#3b82f6",
                  }}
                >
                  Ksh {eventData?.ticketPrice || "N/A"}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "normal",
                      color: "#6b7280",
                    }}
                  >
                    {" "}
                    per ticket
                  </span>
                </div>
              </div>

              {/* Phone Number Input */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  M-Pesa Phone Number
                </label>
                <div style={{ position: "relative" }}>
                  <MdPhone
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      color: "#6b7280",
                    }}
                  />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="254712345678"
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 44px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "16px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "4px",
                    margin: "4px 0 0 0",
                  }}
                >
                  Format: 254XXXXXXXXX (Safaricom)
                </p>
              </div>

              {/* Quantity Selector */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Number of Tickets
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <button
                    onClick={decreaseQuantity}
                    disabled={ticketQuantity <= 1}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1px solid #d1d5db",
                      backgroundColor:
                        ticketQuantity <= 1 ? "#f3f4f6" : "white",
                      cursor: ticketQuantity <= 1 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdRemove style={{ width: "16px", height: "16px" }} />
                  </button>
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      width: "48px",
                      textAlign: "center",
                    }}
                  >
                    {ticketQuantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={ticketQuantity >= availableTickets}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1px solid #d1d5db",
                      backgroundColor:
                        ticketQuantity >= availableTickets
                          ? "#f3f4f6"
                          : "white",
                      cursor:
                        ticketQuantity >= availableTickets
                          ? "not-allowed"
                          : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MdAdd style={{ width: "16px", height: "16px" }} />
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                    color: "#6b7280",
                    marginTop: "8px",
                    margin: "8px 0 0 0",
                  }}
                >
                  Limited by available tickets only
                </p>
              </div>

              {/* Price Summary */}
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span>Tickets ({ticketQuantity}x)</span>
                  <span>Ksh {totalPrice.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: "#3b82f6" }}>
                    Ksh {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              {paymentStatus && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor:
                      paymentStatus.status === "completed"
                        ? "#d1fae5"
                        : paymentStatus.status === "failed"
                        ? "#fee2e2"
                        : "#fef3c7",
                    border: `1px solid ${
                      paymentStatus.status === "completed"
                        ? "#10b981"
                        : paymentStatus.status === "failed"
                        ? "#dc2626"
                        : "#f59e0b"
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    {paymentStatus.status === "completed" && (
                      <MdCheckCircle
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#10b981",
                        }}
                      />
                    )}
                    {paymentStatus.status === "failed" && (
                      <MdCancel
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#dc2626",
                        }}
                      />
                    )}
                    {paymentStatus.status === "pending" && (
                      <MdPayment
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#f59e0b",
                        }}
                      />
                    )}
                    <span style={{ fontWeight: "500", fontSize: "14px" }}>
                      {paymentStatus.status === "completed"
                        ? "Payment Successful"
                        : paymentStatus.status === "failed"
                        ? "Payment Failed"
                        : "Payment Pending"}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", margin: 0, color: "#374151" }}>
                    {paymentStatus.message}
                  </p>
                  {paymentStatus.status === "pending" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <PuffLoader size={16} color="#f59e0b" />
                      <span style={{ fontSize: "12px", color: "#92400e" }}>
                        Waiting for payment confirmation...
                      </span>
                    </div>
                  )}
                  {(paymentStatus.status === "failed" ||
                    paymentStatus.status === "completed") && (
                    <button
                      onClick={resetPaymentStatus}
                      style={{
                        marginTop: "8px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        backgroundColor: "transparent",
                        border: "1px solid #6b7280",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "#6b7280",
                      }}
                    >
                      {paymentStatus.status === "completed"
                        ? "Book Another"
                        : "Try Again"}
                    </button>
                  )}
                </div>
              )}

              {/* Booking Button */}
              {availableTickets > 0 ? (
                <button
                  onClick={handleMpesaBooking}
                  disabled={
                    isBooking ||
                    !isAuthenticated ||
                    paymentStatus?.status === "pending"
                  }
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor:
                      isBooking ||
                      !isAuthenticated ||
                      paymentStatus?.status === "pending"
                        ? "#9ca3af"
                        : "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor:
                      isBooking ||
                      !isAuthenticated ||
                      paymentStatus?.status === "pending"
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {isBooking ? (
                    <>
                      <PuffLoader size={20} color="#ffffff" />
                      Initiating Payment...
                    </>
                  ) : paymentStatus?.status === "pending" ? (
                    <>
                      <MdPayment style={{ width: "20px", height: "20px" }} />
                      Payment Pending
                    </>
                  ) : !isAuthenticated ? (
                    "Login to Book"
                  ) : (
                    <>
                      <MdPayment style={{ width: "20px", height: "20px" }} />
                      Pay with M-Pesa
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "#9ca3af",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "not-allowed",
                  }}
                >
                  Sold Out
                </button>
              )}

              {!isAuthenticated && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#6b7280",
                    marginTop: "12px",
                    margin: "12px 0 0 0",
                  }}
                >
                  <button
                    onClick={() => navigate("/login")}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#3b82f6",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Sign in
                  </button>{" "}
                  to book tickets
                </p>
              )}

              {/* Event Status */}
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                  }}
                >
                  <MdStar
                    style={{ width: "16px", height: "16px", color: "#f59e0b" }}
                  />
                  <span style={{ fontWeight: "500" }}>Event Status:</span>
                  <span
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  >
                    Available
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "4px",
                    margin: "4px 0 0 0",
                  }}
                >
                  {eventData?.ticketsSold || 0} tickets sold •{" "}
                  {availableTickets} remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

