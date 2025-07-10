import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";

export const Topbar = () => {
  return (
    <div
      className="navbar shadow-md text-white"
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
              <Link to="/">Home</Link>
            </li>
            <li className="hover:underline">
              <Link to="/events">Events</Link>
            </li>
            <li className="hover:underline">
              <Link to="/blogs">Blogs</Link>
            </li>
            <li className="hover:underline">
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Right - Action Buttons */}
      <div className="navbar-end space-x-2 mr-2 hidden lg:flex">
        <Link
          to="/help"
          className="bg-gray-100 text-black px-4 py-1 rounded-full text-sm font-medium hover:underline"
        >
          Help
        </Link>
        <div className="flex justify-between ml-7">
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
    </div>
  );
};
