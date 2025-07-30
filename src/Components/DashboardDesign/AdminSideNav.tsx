import {
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Mail,
  Newspaper,
  Settings,
  CreditCard,
  Users,
  MapPin,
  BarChart3,
} from "lucide-react";
import type { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearCredentials } from "../../Features/auth/authSlice";

interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

interface SideNavProps {
  collapsed: boolean;
  onNavClick?: () => void; // Add this prop
}

export const AdminSideNav = ({ collapsed, onNavClick }: SideNavProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="flex flex-col h-full p-4 text-sm text-gray-100 bg-[#093FB4]">
      <div
        className={`text-xl font-bold text-orange-500 mb-6 ${
          collapsed ? "text-center" : ""
        }`}
      >
        {!collapsed && "TicKenya"}
        {collapsed && "TK"}
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem
          to="/admindashboard"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={
            isActive("/admindashboard") &&
            location.pathname === "/admindashboard"
          }
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/admindashboard/bookings"
          icon={<CalendarDays size={20} />}
          label="All Bookings"
          active={isActive("/admindashboard/bookings")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/admindashboard/events"
          icon={<Newspaper size={20} />}
          label="All Events"
          active={isActive("/admindashboard/events")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/admindashboard/venues"
          icon={<MapPin size={20} />}
          label="All Venues"
          active={isActive("/admindashboard/venues")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/admindashboard/payments"
          icon={<CreditCard size={20} />}
          label="Payments"
          active={isActive("/admindashboard/payments")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/admindashboard/support"
          icon={<Mail size={20} />}
          label="Support Tickets"
          active={isActive("/admindashboard/support")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/admindashboard/users"
          icon={<Users size={20} />}
          label="All Users"
          active={isActive("/admindashboard/users")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/admindashboard/reports"
          icon={<BarChart3 size={20} />}
          label="Sales Reports"
          active={isActive("/admindashboard/reports")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
      </nav>

      <div className="pt-4 border-t border-white/10 space-y-2">
        {/* Profile and Settings remain at the bottom, but act as nav items */}
        <NavItem
          to="/admindashboard/profile"
          icon={<Users size={20} />}
          label="Admin Profile"
          active={isActive("/admindashboard/profile")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/admindashboard/settings"
          icon={<Settings size={20} />}
          label="Settings"
          active={isActive("/admindashboard/settings")}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <button
          className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 px-2 py-2 rounded transition cursor-pointer hover:bg-white/5"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  to,
  active,
  collapsed,
  onClick,
}: NavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-2 py-2 rounded-md transition ${
      active
        ? "bg-white/10 text-white font-semibold"
        : "hover:bg-white/5 text-white/80"
    }`}
    onClick={onClick}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </Link>
);
