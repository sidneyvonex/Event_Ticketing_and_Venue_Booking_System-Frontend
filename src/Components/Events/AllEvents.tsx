import { Link } from "react-router-dom";
import { eventApi } from "../../Features/api/EventApi";
import type { EventsDataTypes } from "../../types/types";
import { PuffLoader } from "react-spinners";
import { useState } from "react";
import { Toaster, toast } from "sonner"; // Add this import

interface AllEventsProps {
  basePath?: string; // Optional prop to customize the link path
}

export const AllEvents = ({ basePath = "/events" }: AllEventsProps) => {
  //To Covert Date to weekday,day,month, year  and date(12hour format)
  const formatDateTime = (eventDate: string, eventTime: string) => {
    const datePart = new Date(eventDate).toISOString().split("T")[0];
    const combined = new Date(`${datePart}T${eventTime}`);
    return combined.toLocaleString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const {
    data: eventsData,
    isLoading,
    error,
  } = eventApi.useGetAllEventsQuery({});

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Filter and sort events
  let filteredEvents = eventsData || [];
  if (searchTerm.trim() !== "") {
    filteredEvents = filteredEvents.filter(
      (event: EventsDataTypes) =>
        event.eventTitle
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()) ||
        event.venue.venueName
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
    );
  }
  if (filterCategory) {
    filteredEvents = filteredEvents.filter(
      (event: EventsDataTypes) =>
        event.category?.toLowerCase() === filterCategory.toLowerCase()
    );
  }
  if (sortBy === "date") {
    filteredEvents = [...filteredEvents].sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  } else if (sortBy === "price") {
    filteredEvents = [...filteredEvents].sort(
      (a, b) => Number(a.ticketPrice) - Number(b.ticketPrice)
    );
  }

  // Show a toast notification when loading events
  if (isLoading) {
    toast.loading("Loading events...", { id: "events-loading" });
  } else {
    toast.dismiss("events-loading");
  }

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Toaster for notifications */}
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-base-content border-l-4 border-primary pl-4">
          All Events
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
          <input
            className="input input-bordered rounded-md px-4 w-full sm:w-56"
            placeholder="Search by event or venue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="select select-bordered rounded-md w-full sm:w-40"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="music">Music</option>
            <option value="sport">Sport</option>
            <option value="fashion">Fashion</option>
            <option value="art-design">Art & Design</option>
          </select>
          <select
            className="select select-bordered rounded-md w-full sm:w-36"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="date">Date</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {error ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-red-500">Something Went Wrong</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-48">
          <PuffLoader size={60} color="#0f172a" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-3xl text-red-500">Oops! - No Events Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event: EventsDataTypes) => (
            <Link
              to={`${basePath}/${event.eventId}`}
              key={event.eventId}
              className="block group transition duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="card w-full bg-base-100 rounded-2xl shadow-sm group-hover:shadow-lg transition duration-300 h-full cursor-pointer">
                <figure className="p-3">
                  <img
                    src={event.eventImageUrl}
                    alt={event.eventTitle}
                    className="rounded-xl object-cover w-full h-48"
                  />
                </figure>
                <div className="card-body space-y-2">
                  <h2 className="card-title text-lg">{event.eventTitle}</h2>
                  <p className="text-sm">
                    <span className="font-semibold text-base-content"></span>{" "}
                    <span className="text-red-800">
                      {formatDateTime(event.eventDate, event.eventTime)}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-base-content">
                      Venue:
                    </span>{" "}
                    <span className="text-gray-600">
                      {event.venue.venueName}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-base-content">
                      Price:
                    </span>{" "}
                    <span className="text-gray-700">
                      Ksh {event.ticketPrice}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
