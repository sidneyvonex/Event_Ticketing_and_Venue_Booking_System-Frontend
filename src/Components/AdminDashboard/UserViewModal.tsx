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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="font-semibold">Name:</div>
            <div>
              {user.firstName} {user.lastName}
            </div>
            <div className="font-semibold mt-2">Email:</div>
            <div>{user.email}</div>
            <div className="font-semibold mt-2">Phone:</div>
            <div>{user.contactPhone || "N/A"}</div>
            <div className="font-semibold mt-2">Address:</div>
            <div>{user.address || "N/A"}</div>
            <div className="font-semibold mt-2">Role:</div>
            <div>{user.userRole || "user"}</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Bookings Made:</div>
            <ul className="list-disc ml-4">
              {user.bookings && user.bookings.length > 0 ? (
                user.bookings.map((booking: any) => (
                  <li key={booking.bookingId}>
                    Event: {booking.event?.eventTitle || "N/A"}
                    <br />
                    Tickets: {booking.quantity}
                    <br />
                    Date:{" "}
                    {booking.event?.eventDate
                      ? new Date(booking.event.eventDate).toLocaleDateString()
                      : "N/A"}
                  </li>
                ))
              ) : (
                <li>No bookings found.</li>
              )}
            </ul>
            <div className="font-semibold mt-4 mb-2">Events Attended:</div>
            <ul className="list-disc ml-4">
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
      </div>
    </div>
  );
};
