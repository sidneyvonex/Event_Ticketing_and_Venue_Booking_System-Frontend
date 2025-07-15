import { Bell, LayoutDashboard, LogOut, Menu, Settings } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import type { RootState } from "../../Features/app/store";
import { clearCredentials } from "../../Features/auth/authSlice";

interface TopbarProps {
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
}

export const Topbar = ({ toggleSidebar, toggleMobileSidebar }: TopbarProps) => {
  const dispatch = useDispatch();
   const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth);

  const initials = user?.fullName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const profileImage = user?.profileUrl;

    const handleLogout = async()=>{
      dispatch(clearCredentials())
      navigate('/login')
    }

  return (
    <header className="w-full bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 shadow-sm z-10">
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
            className="btn btn-ghost btn-circle avatar border-0"
          >
            {profileImage ? (
              <div className="w-10 rounded-full overflow-hidden hover:outline-1 hover:outline-offset-2 hover:outline-solid">
                <img src={profileImage} alt="Profile Image" />
              </div>
            ) : (
              <span className="text-white font-semibold text-lg   leading-none">
                {initials}
              </span>
            )}
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-50 mt-3 w-52 p-2 shadow-lg bg-white transition-all duration-300 ease-in-out border border-gray-200"
          >
            <li>
              <a className="text-gray-700 hover:bg-[#093FB4] hover:text-white px-3 py-2 rounded transition-colors duration-200">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </a>
            </li>
            <li>
              <a className="text-gray-700 hover:bg-[#093FB4] hover:text-white px-3 py-2 rounded transition-colors duration-200">
                <Settings className="w-4 h-4" />
                Settings
              </a>
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
