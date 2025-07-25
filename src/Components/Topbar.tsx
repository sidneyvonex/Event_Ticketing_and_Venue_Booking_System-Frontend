import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { useSelector } from "react-redux";
import type { RootState } from "../Features/app/store";
import { useGetUserByIdQuery } from "../Features/api/userApi";
import {
  CalendarDays,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Newspaper,
  Settings,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../Features/auth/authSlice";

export const Topbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Get user ID from auth state
  const userId = user?.userId;

  // Fetch fresh user data from backend
  const { data: userProfile, isLoading: isLoadingProfile } =
    useGetUserByIdQuery(userId, {
      skip: !userId || !isAuthenticated, // Skip query if no userId or not authenticated
      refetchOnMountOrArgChange: true, // Always fetch fresh data
    });

  // Get profile picture from fresh API data, fallback to persisted data
  const apiUserData = userProfile?.user || userProfile?.data || userProfile;

  const profileImage = apiUserData?.profilePicture || user?.profileUrl;

  // Generate initials for fallback
  const getInitials = () => {
    // Use fresh data first, then fallback to persisted data
    const fullName =
      apiUserData?.firstName && apiUserData?.lastName
        ? `${apiUserData.firstName} ${apiUserData.lastName}`
        : user?.fullName;

    if (fullName) {
      return fullName
        .split(" ")
        .map((name: string) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  const handleLogout = async () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <div
      className="navbar shadow-md text-white sticky top-0 z-50"
      style={{ backgroundColor: "#093FB4" }}
    >
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white text-black rounded-box w-52"
          >
            <li className=" btn-ghost border-b-1 hover:underline">
              <Link to="/">Home</Link>
            </li>
            <li className=" btn-ghost border-b-1 hover:underline">
              <Link to="/events">Events</Link>
            </li>
            <li className=" btn-ghost border-b-1 hover:underline">
              <Link to="/blogs">Blogs</Link>
            </li>
            <li className=" btn-ghost border-b-1 hover:underline">
              <Link to="/venues">Contact Us</Link>
            </li>
            <li className=" btn-ghost border-b-1 hover:underline">
              <Link to="/login">Login</Link>
            </li>
            <li className=" btn-ghost border-b-1 hover:underline">
              <Link to="/register">Sign Up</Link>
            </li>
          </ul>
        </div>

        <Link to="/" className="flex items-center gap-2 ml-2">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold">
            <span className="text-white">Tic</span>
            <span style={{ color: "#ED3500" }}>Kenya</span>
          </span>
        </Link>

        <div className=" ml-10 hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-white font-normal gap-4">
            <li className="hover:underline">
              <Link to="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </li>
            <li className="hover:underline">
              <Link to="/events">
                <CalendarDays className="w-4 h-4" />
                Events
              </Link>
            </li>
            <li className="hover:underline">
              <Link to="/blogs">
                <Newspaper className="w-4 h-4" />
                Blogs
              </Link>
            </li>
            <li className="hover:underline">
              <Link to="/contact">
                <Mail className="w-4 h-4" />
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {!isAuthenticated ? (
        <div className="navbar-end space-x-2 mr-2 hidden lg:flex">
          <Link
            to="/help"
            className="bg-gray-100 text-black px-4 py-1 rounded-full text-sm font-medium hover:underline"
          >
            Help
          </Link>

          <Link
            to="/login"
            className="px-4 py-1 border border-white text-white rounded text-sm font-medium hover:bg-white hover:text-[#093FB4] transition-all duration-150"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-1 bg-[#ED3500] text-white rounded text-sm font-medium hover:opacity-90 transition-all duration-150"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="navbar-end space-x-2 mr-2 hidden lg:flex">
          <Link
            to="/help"
            className="bg-gray-100 text-black px-4 py-1 rounded-full text-sm font-medium hover:underline"
          >
            Help
          </Link>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className={`btn btn-ghost btn-circle avatar border-0 ${
                !profileImage ? "bg-[#ED3500]" : ""
              } ${isLoadingProfile ? "loading" : ""}`}
            >
              <div className="w-10 rounded-full overflow-hidden hover:outline-1 hover:outline-offset-2 hover:outline-solid">
                {isLoadingProfile ? (
                  // Loading spinner while fetching profile
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-[#093FB4] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : profileImage ? (
                  // Show profile image if available
                  <img
                    src={profileImage}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide image and show initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  // Show initials when no profile image
                  <div className="w-full h-full bg-[#ED3500] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content rounded-box z-50 mt-3 w-52 p-2 shadow-lg bg-white transition-all duration-300 ease-in-out border border-gray-200"
            >
              <li>
                <Link
                  to={
                    user?.userRole === "admin"
                      ? "/admindashboard"
                      : "/dashboard"
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
      )}
    </div>
  );
};
