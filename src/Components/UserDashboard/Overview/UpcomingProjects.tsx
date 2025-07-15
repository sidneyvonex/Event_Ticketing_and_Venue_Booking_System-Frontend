/* eslint-disable @typescript-eslint/no-explicit-any */
export const UpcomingEvents = ({ events }: { events: any[] }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
    <ul className="space-y-2">
      {events.map((event) => (
        <li key={event.id} className="border-b pb-2 text-sm">
          <strong>{event.title}</strong> — {event.date}
        </li>
      ))}
    </ul>
  </div>
);
