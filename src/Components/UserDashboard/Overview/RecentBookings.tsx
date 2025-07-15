/* eslint-disable @typescript-eslint/no-explicit-any */
export const RecentBookings = ({ bookings }: { bookings: any[] }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-2">Recent Bookings</h3>
    <ul className="space-y-2">
      {bookings.map((booking) => (
        <li key={booking.id} className="border-b pb-2 text-sm">
          <strong>{booking.name}</strong> booked for <em>{booking.event}</em> —{" "}
          {booking.date}
        </li>
      ))}
    </ul>
  </div>
);