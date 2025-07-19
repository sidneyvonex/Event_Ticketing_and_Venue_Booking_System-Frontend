import { Link } from "react-router-dom";
import { eventApi } from "../../Features/api/EventApi";
import type { EventsDataTypes } from "../../types/types";
import { PuffLoader } from "react-spinners";

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

  return (
    <div>
      <div className="py-5 max-w-full flex justify-center">
        <div className="join">
          <div>
            <div>
              <input
                className="input join-item  rounded-md px-15"
                placeholder="Search"
              />
            </div>
          </div>
          <select className="select join-item" defaultValue="">
            <option disabled value="">
              Filter
            </option>
            <option value="music">Music</option>
            <option value="sport">Sport</option>
            <option value="fashion">Fashion</option>
            <option value="art-design">Art & Design</option>
          </select>
          <div className="indicator">
            <button className="btn join-item">Search</button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-red-500">Something Went Wrong</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-48">
          <PuffLoader size={60} color="#0f172a" />
        </div>
      ) : eventsData?.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-3xl text-red-500">Oops! - No Events Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {eventsData.map((event: EventsDataTypes) => (
            <Link
              to={`${basePath}/${event.eventId}`}
              key={event.eventId}
              className="block group  transition duration-300 transform hover:scale-[1.02]  hover:shadow-lg"
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
                  <div className="pt-2">
                    <button
                      className="btn btn-sm btn-primary bg-[#093FB4] border-none rounded-lg text-white group-hover:bg-[#093fb4c8] cursor-pointer"
                      type="button"
                    >
                      Buy Ticket
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
