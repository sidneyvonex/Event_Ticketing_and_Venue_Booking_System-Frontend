import { CalendarDays, Home, LogOut, Mail, Newspaper, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  active:boolean;
}

export const UserSideNav = () => {
  return (
    <div className="p-4 space-y-4 text-sm text-gray-700 font-medium">
      <div className="text-xl font-bold text-[#7A4AE3] mb-6">🎟️ TicKenya</div>
      <nav className="space-y-2">
        <NavItem icon={<Home size={18} />} label="Dashboard" to="/dashboard" active />
        <NavItem
                  icon={<CalendarDays size={18} />}
                  label="Bookings"
                  to="/dashboard/bookings" active={false}        />
        <NavItem icon={<Newspaper size={18} />} label="Events" to="/dashboard/events" active={false} />
        <NavItem icon={<Mail size={18} />} label="Inbox" to="/inbox" active={false} />
        <NavItem
                  icon={<Settings size={18} />}
                  label="Settings"
                  to="/settings" active={false}        />
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <button className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg w-full transition">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to, active = false }:NavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
      active
        ? "bg-[#ECE8FD] text-[#7A4AE3] font-semibold"
        : "hover:bg-gray-100 text-gray-600"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);
