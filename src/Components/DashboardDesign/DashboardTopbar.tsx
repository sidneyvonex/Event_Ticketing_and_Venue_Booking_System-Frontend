import { Bell, LayoutDashboard, LogOut, Menu, Settings } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../Features/app/store";
import { clearCredentials } from "../../Features/auth/authSlice";

interface TopbarProps {
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

export const Topbar = ({ toggleSidebar, toggleMobileSidebar }: TopbarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const profileImage = user?.profileUrl;

  // Generate initials for fallback
  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((name: string) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    getInitials()
  )}&background=ED3500&color=fff&size=128&bold=true`;

  const handleLogout = async () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <header className="w-full bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm z-10 sticky top-0">
      {/* Left: Hamburger + Page Title */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="hidden lg:block">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <button onClick={toggleMobileSidebar} className="block lg:hidden">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Right: Notifications and Profile */}
      <div className="flex items-center gap-4">
        <button className="btn btn-ghost border-0 btn-circle">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className={`btn btn-ghost btn-circle avatar border-0 ${
              !profileImage ? "bg-[#ED3500]" : ""
            }`}
          >
            <div className="w-10 rounded-full overflow-hidden hover:outline-1 hover:outline-offset-2 hover:outline-solid">
              <img
                src={profileImage || fallbackAvatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackAvatar;
                }}
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-50 mt-3 w-52 p-2 shadow-lg bg-white transition-all duration-300 ease-in-out border border-gray-200"
          >
            <li>
              <Link
                to={
                  user?.userRole === "admin" ? "/admindashboard" : "/dashboard"
                }
                className="text-gray-700 hover:bg-[#093FB4] hover:text-white px-3 py-2 rounded transition-colors duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="profile"
                className="text-gray-700 hover:bg-[#093FB4] hover:text-white px-3 py-2 rounded transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                Profile
              </Link>
            </li>
            <li>
              <button
                className="text-gray-700 hover:bg-[#093FB4] hover:text-white px-3 py-2 rounded transition-colors duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
