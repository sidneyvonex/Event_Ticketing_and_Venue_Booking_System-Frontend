import {
  CalendarDays,
  LogOut,
  Mail,
  Newspaper,
  Settings,
  CreditCard,
  Users,
  LayoutDashboard,
} from "lucide-react";
import type { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  onNavClick?: () => void;
}

export const UserSideNav = ({ collapsed, onNavClick }: SideNavProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(clearCredentials());
    navigate("/login");
    if (onNavClick) onNavClick();
  };

  return (
    <div
      className={`flex flex-col h-full p-4 text-sm text-gray-100 bg-[#093FB4]`}
    >
      <div
        className={`text-xl font-bold text-orange-500 mb-6 ${
          collapsed ? "text-center" : ""
        }`}
      >
        {!collapsed && "TicKenya"}
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem
          to="/dashboard"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={false}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/dashboard/bookings"
          icon={<CalendarDays size={20} />}
          label="Bookings"
          active={false}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/dashboard/events"
          icon={<Newspaper size={20} />}
          label="Events"
          active={false}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/dashboard/payments"
          icon={<CreditCard size={20} />}
          label="Payments"
          active={false}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/dashboard/support"
          icon={<Mail size={20} />}
          label="Support"
          active={false}
          collapsed={collapsed}
          onClick={onNavClick}
        />
        <NavItem
          to="/dashboard/profile"
          icon={<Users size={20} />}
          label="Profile"
          active={false}
          collapsed={collapsed}
          onClick={onNavClick}
        />
      </nav>

      <div className="pt-4 border-t border-white/10 space-y-2">
        <NavItem
          to="/dashboard/settings"
          icon={<Settings size={20} />}
          label="Settings"
          active={false}
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
