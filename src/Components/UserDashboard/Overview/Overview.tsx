// src/pages/Dashboard.tsx

import { WelcomeCard } from "./UserWelcomeCard";
import { StatCard } from "./StatCard";
import { CalendarWidget } from "./CalendarWidget";
import { UpcomingEvents } from "./UpcomingProjects";
import { RecentBookings } from "./RecentBookings";
import { QuickActions } from "./QuickActions";

const mockUser = { fullName: "Sidney Githu" };
const mockEvents = [
  { id: 1, title: "Tech Fest 2025", date: "July 20, 2025" },
  { id: 2, title: "Fashion Gala", date: "July 22, 2025" },
  { id: 3, title: "Music Concert", date: "July 25, 2025" },
];
const mockBookings = [
  { id: 1, name: "James Kariuki", event: "Tech Fest", date: "July 14, 2025" },
  { id: 2, name: "Ann Wambui", event: "Fashion Gala", date: "July 13, 2025" },
  {
    id: 3,
    name: "David Mwangi",
    event: "Music Concert",
    date: "July 12, 2025",
  },
];

export const Dashboard = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <WelcomeCard user={mockUser} />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value="124" icon="🎟️" color="blue" />
        <StatCard title="Active Bookings" value="12" icon="✅" color="green" />
        <StatCard title="Upcoming Events" value="8" icon="📅" color="purple" />
        <StatCard title="This Month" value="45" icon="📊" color="orange" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-1 space-y-6">
          <CalendarWidget />
          <QuickActions />
        </div>

        {/* Right Column - Events and Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingEvents events={mockEvents} />
          <RecentBookings bookings={mockBookings} />
        </div>
      </div>
    </div>
  );
};
