// src/pages/Dashboard.tsx

import { WelcomeCard } from "./UserWelcomeCard";
import { StatCard } from "./StatCard";
import { CalendarWidget } from "./CalendarWidget";
import { UpcomingEvents } from "./UpcomingProjects";
import { RecentBookings } from "./RecentBookings";

const mockUser = { fullName: "Sidney Githu" };
const mockEvents = [
  { id: 1, title: "Tech Fest 2025", date: "July 20, 2025" },
  { id: 2, title: "Fashion Gala", date: "July 22, 2025" },
];
const mockBookings = [
  { id: 1, name: "James Kariuki", event: "Tech Fest", date: "July 14, 2025" },
  { id: 2, name: "Ann Wambui", event: "Fashion Gala", date: "July 13, 2025" },
];

export const Dashboard = () => {
  return (
    <div className="p-4 space-y-6">
      <WelcomeCard user={mockUser} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value="124" />
        <StatCard title="Active Bookings" value="12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CalendarWidget />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <UpcomingEvents events={mockEvents} />
          <RecentBookings bookings={mockBookings} />
        </div>
      </div>
    </div>
  );
};

// src/components/WelcomeCard.tsx


// src/components/StatCard.tsx


// src/components/CalendarWidget.tsx


// src/components/UpcomingEvents.tsx

// src/components/RecentBookings.tsx


// src/global.d.ts

