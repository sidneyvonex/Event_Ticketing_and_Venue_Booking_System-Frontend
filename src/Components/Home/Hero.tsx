/* eslint-disable @typescript-eslint/no-explicit-any */
import HeroImg from "../../assets/Hero.jpeg";
import { useState } from "react";
import { eventApi } from "../../Features/api/EventApi";
import { PuffLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);
  const { data: eventsData = [], isLoading } = eventApi.useGetAllEventsQuery(
    {}
  );
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    // Filter events by event name and venue
    const filtered = eventsData.filter((event: any) => {
      const matchesName =
        eventName.trim() === "" ||
        event.eventTitle.toLowerCase().includes(eventName.trim().toLowerCase());
      const matchesVenue =
        venue.trim() === "" ||
        event.venue.venueName
          .toLowerCase()
          .includes(venue.trim().toLowerCase());
      return matchesName && matchesVenue;
    });
    setSearchResults(filtered);
    setSearching(false);
  };

  // Only show results after a search is performed and at least one field is filled
  const shouldShowResults =
    searchResults !== null && (eventName.trim() !== "" || venue.trim() !== "");

  return (
    <>
      <div>
        <div
          className="h-[60vh] bg-cover bg-center bg-no-repeat relative flex items-center justify-center "
          style={{ backgroundImage: `url(${HeroImg})` }}
        >
          <div className="bg-white/40 backdrop-blur-sm rounded shadow-lg w-full max-w-md mx-auto p-6">
            <div className="flex justify-center mb-4">
              <button className="px-4 py-0 text-[#ED3500] border-t-2 border-[#ED3500] font-semibold">
                Events
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Event Name..."
                className="border border-gray-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Venue"
                className="border border-gray-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
              <div className="mt-6">
                <button
                  className="bg-[#ED3500] w-full text-white py-2 rounded hover:opacity-80 transition cursor-pointer"
                  type="submit"
                  disabled={isLoading || searching}
                >
                  {searching ? "Searching..." : "Find Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Search Results Section */}
        {shouldShowResults && (
          <div className="max-w-4xl mx-auto mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <PuffLoader size={40} color="#0f172a" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-red-500 text-xl py-8 bg-white rounded-xl shadow">
                No events found.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {searchResults.map((event: any) => (
                  <div
                    key={event.eventId}
                    className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row border border-gray-100 hover:shadow-2xl transition duration-200 cursor-pointer group overflow-hidden"
                    onClick={() => navigate(`/tickets/${event.eventId}`)}
                  >
                    <div className="relative md:w-1/3 w-full flex-shrink-0">
                      <img
                        src={event.eventImageUrl}
                        alt={event.eventTitle}
                        className="object-cover w-full h-44 md:h-full border-b md:border-b-0 md:border-r border-gray-200 group-hover:scale-105 transition-transform duration-200"
                      />
                      <span className="absolute top-2 right-2 bg-[#ED3500] text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
                        {event.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col gap-2 flex-1 justify-between">
                      <div>
                        <div className="font-bold text-xl text-blue-900 mb-1">
                          {event.eventTitle}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm mb-2">
                          <span className="bg-blue-50 text-blue-800 px-2 py-1 rounded">
                            <span className="font-semibold">Venue:</span>{" "}
                            {event.venue.venueName}
                          </span>
                          <span className="bg-green-50 text-green-800 px-2 py-1 rounded">
                            <span className="font-semibold">Date:</span>{" "}
                            {event.eventDate}
                          </span>
                          <span className="bg-yellow-50 text-yellow-800 px-2 py-1 rounded">
                            <span className="font-semibold">Time:</span>{" "}
                            {event.eventTime}
                          </span>
                          <span className="bg-purple-50 text-purple-800 px-2 py-1 rounded">
                            <span className="font-semibold">Price:</span> Ksh{" "}
                            {event.ticketPrice}
                          </span>
                        </div>
                        <div className="text-gray-700 mb-2">
                          <span className="font-semibold">Description:</span>{" "}
                          {event.description || "No description provided."}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>
                            Tickets Available:{" "}
                            {event.ticketsTotal - event.ticketsSold}
                          </span>
                          <span>Total Tickets: {event.ticketsTotal}</span>
                          <span>Sold: {event.ticketsSold}</span>
                          <span>Organizer: {event.organizerName || "N/A"}</span>
                        </div>
                      </div>
                      <button
                        className="mt-4 btn btn-sm btn-primary bg-[#093FB4] border-none rounded-lg text-white group-hover:bg-[#093fb4c8] w-full md:w-auto"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${event.eventId}`);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
