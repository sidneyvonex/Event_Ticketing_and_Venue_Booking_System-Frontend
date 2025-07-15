export const UserBookings = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">My Bookings</h2>

      <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-md">
        <table className="table w-full">
          {/* Table Head */}
          <thead className="bg-base-200 text-base-content border-b border-base-300">
            <tr>
              <th>#</th>
              <th>Event</th>
              <th>Date & Time</th>
              <th>Venue</th>
              <th>Tickets</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-base-200">
            <tr className="hover:bg-base-100">
              <td>1</td>
              <td className="font-semibold">Sidney's Comedy Night</td>
              <td>July 10, 2025 - 5:24 PM</td>
              <td>Habanos Gardens</td>
              <td>3</td>
              <td>Kshs 2,000</td>
              <td>
                <span className="badge badge-success">Confirmed</span>
              </td>
            </tr>

            <tr className="hover:bg-base-100">
              <td>2</td>
              <td className="font-semibold">Tech Summit 2025</td>
              <td>August 5, 2025 - 9:00 AM</td>
              <td>Radisson Blu</td>
              <td>1</td>
              <td>Kshs 1,500</td>
              <td>
                <span className="badge badge-warning">Pending</span>
              </td>
            </tr>

            <tr className="hover:bg-base-100">
              <td>3</td>
              <td className="font-semibold">Music Fest</td>
              <td>September 1, 2025 - 6:00 PM</td>
              <td>Nyayo Stadium</td>
              <td>2</td>
              <td>Kshs 3,000</td>
              <td>
                <span className="badge badge-error">Cancelled</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
