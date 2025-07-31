import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import {
  CalendarDays,
  Home,
  Mail,
  Newspaper,
  X,
  HelpCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

export const Topbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="navbar shadow-md text-white sticky top-0 z-50"
      style={{ backgroundColor: "#093FB4" }}
    >
      <div className="navbar-start">
        {/* Mobile Sidebar Hamburger */}
        <button
          className="btn btn-ghost text-white lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </button>

        {/* Sidebar Overlay & Drawer */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
              onClick={() => setSidebarOpen(false)}
            />
            <nav
              className="fixed top-0 left-0 h-full w-60 bg-[#093FB4] text-white z-[100] shadow-2xl flex flex-col"
              style={{
                transition: "transform 0.3s",
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <img src={Logo} alt="Logo" className="h-8 w-8" />
                  <span className="text-lg font-semibold">
                    <span className="text-white">Tic</span>
                    <span style={{ color: "#ED3500" }}>Kenya</span>
                  </span>
                </Link>
                <button
                  className="btn btn-ghost text-white"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ul className="flex-1 flex flex-col px-6 py-6">
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-white/10 transition group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </Link>
                  <div className="h-px bg-white/10 w-full group-hover:bg-white/30 transition"></div>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-white/10 transition group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <CalendarDays className="w-5 h-5" />
                    Events
                  </Link>
                  <div className="h-px bg-white/10 w-full group-hover:bg-white/30 transition"></div>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-white/10 transition group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Newspaper className="w-5 h-5" />
                    Blogs
                  </Link>
                  <div className="h-px bg-white/10 w-full group-hover:bg-white/30 transition"></div>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-white/10 transition group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Mail className="w-5 h-5" />
                    Contact Us
                  </Link>
                  <div className="h-px bg-white/10 w-full group-hover:bg-white/30 transition"></div>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-white/10 transition group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <HelpCircle className="w-5 h-5" />
                    Help
                  </Link>
                  <div className="h-px bg-white/10 w-full group-hover:bg-white/30 transition"></div>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-white/10 transition group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                  <div className="h-px bg-white/10 w-full group-hover:bg-white/30 transition"></div>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-white/10 transition group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    Sign Up
                  </Link>
                  {/* No divider after last link */}
                </li>
              </ul>
            </nav>
          </>
        )}

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 ml-2">
          <img src={Logo} alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold">
            <span className="text-white">Tic</span>
            <span style={{ color: "#ED3500" }}>Kenya</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="ml-10 hidden lg:flex">
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

      {/* Right-side buttons */}
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
    </div>
  );
};
