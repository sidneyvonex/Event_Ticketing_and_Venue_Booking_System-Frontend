/* eslint-disable @typescript-eslint/no-explicit-any */

export const UserViewModal = ({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
}) => {
  if (!open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-1 sm:px-0">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative border border-blue-200 mx-1 sm:mx-0">
        <button
          className="absolute top-3 right-3 btn btn-sm btn-circle btn-ghost text-blue-900"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-t-2xl px-2 sm:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.firstName + " " + user.lastName}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow"
            />
          ) : (
            <span className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl border-4 border-white shadow">
              {user.firstName?.[0]?.toUpperCase() || ""}
              {user.lastName?.[0]?.toUpperCase() || ""}
            </span>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <div className="text-blue-100 text-sm font-medium">
              {user.userRole === "admin" ? "Administrator" : "User"}
            </div>
          </div>
        </div>
        <div className="px-1 sm:px-8 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 mb-4 md:mb-0 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Profile Details
            </h3>
            <div className="mb-2">
              <span className="font-semibold text-blue-800">Email:</span>{" "}
              <span className="text-gray-700">{user.email}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-blue-800">Phone:</span>{" "}
              <span className="text-gray-700">
                {user.contactPhone || "N/A"}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-blue-800">Address:</span>{" "}
              <span className="text-gray-700">{user.address || "N/A"}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-blue-800">Role:</span>{" "}
              <span className="text-gray-700">{user.userRole || "user"}</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 shadow-sm mt-2 sm:mt-0">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Bookings Made
            </h3>
            <ul className="list-disc ml-5 text-gray-700">
              {user.bookings && user.bookings.length > 0 ? (
                user.bookings.map((booking: any) => (
                  <li key={booking.bookingId} className="mb-1">
                    <span className="font-semibold">Event:</span>{" "}
                    {booking.event?.eventTitle || "N/A"}
                    <br />
                    <span className="font-semibold">Tickets:</span>{" "}
                    {booking.quantity}
                    <br />
                    <span className="font-semibold">Date:</span>{" "}
                    {booking.event?.eventDate
                      ? new Date(booking.event.eventDate).toLocaleDateString()
                      : "N/A"}
                  </li>
                ))
              ) : (
                <li>No bookings found.</li>
              )}
            </ul>
            <h3 className="text-lg font-semibold text-blue-900 mt-6 mb-2">
              Events Attended
            </h3>
            <ul className="list-disc ml-5 text-gray-700">
              {user.bookings && user.bookings.length > 0 ? (
                user.bookings.map((booking: any) => (
                  <li key={booking.bookingId + "-event"}>
                    {booking.event?.eventTitle || "N/A"}
                  </li>
                ))
              ) : (
                <li>No events attended.</li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex justify-end px-2 sm:px-8 pb-4 sm:pb-6">
          <button
            className="btn btn-outline btn-sm text-blue-900 border-blue-700 hover:bg-blue-50 hover:border-blue-900"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
