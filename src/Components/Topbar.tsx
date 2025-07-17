/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { useSelector } from "react-redux";
import type { RootState } from "../Features/app/store";
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
  const initials = user?.fullName
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase();

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
          <div className="dropdown dropdown-end ml-5 mr-3">
            <div
              tabIndex={0}
              role="button"
              className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-[#ED3500] shadow-md"
            >
              <span className="text-white font-semibold text-lg leading-none">
                {initials}
              </span>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content rounded-box z-50 mt-3 w-52 p-2 shadow-lg bg-white transition-all duration-300 ease-in-out border border-gray-200"
            >
              <li>
                <Link
                  to={user?.role === "admin" ? "/admindashboard" : "/dashboard"}
                  className="text-gray-700 hover:bg-[#093FB4] hover:text-white px-3 py-2 rounded transition-colors duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
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
