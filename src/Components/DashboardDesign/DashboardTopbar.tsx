import { Bell, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Features/app/store";
import avatar from "../../assets/Hero.jpeg"; 

export const Topbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="w-full bg-white px-4 py-3 flex flex-col lg:flex-row lg:justify-between lg:items-center shadow-sm gap-4">
      {/* Left - Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full lg:w-auto">
        <input
          type="text"
          placeholder="Search event, location, etc..."
          className="input input-bordered w-full md:w-80 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4] focus:border-transparent transition-all duration-200"
        />
        <div className="flex gap-2">
          <select className="select select-bordered text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4] focus:border-transparent transition-all duration-200">
            <option>All Category</option>
            <option>Music</option>
            <option>Fashion</option>
            <option>Tech</option>
          </select>
          <select className="select select-bordered text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4] focus:border-transparent transition-all duration-200">
            <option>This Month</option>
            <option>Next Month</option>
            <option>2025</option>
          </select>
        </div>
      </div>

      {/* Right - Avatar and Icons */}
      <div className="flex items-center gap-4 justify-end w-full lg:w-auto">
        <button className="btn btn-ghost btn-circle">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
        <button className="btn btn-ghost btn-circle">
          <Settings className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {user.fullName}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
