import { Link } from "react-router-dom";
import HeroImg from "../../assets/Hero.jpeg";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const RegisterHero = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      <div className="flex items-center justify-center w-full max-w-2xl px-4">
        <div className="bg-white p-10 shadow-md rounded-md w-full">
          <h2 className="text-3xl font-bold mb-2 text-center text-[#093FB4]">
            Create Account
          </h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            Fill in the details to register
          </p>

          <form className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
            />

            {/* Password Field */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password (no toggle) */}
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
            />

            <input
              type="text"
              placeholder="Address"
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
            />

            <button
              type="submit"
              className="btn bg-[#093FB4] text-white w-full hover:bg-[#093fb4cb]"
            >
              Register
            </button>
          </form>

          <p className="text-sm mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[#093FB4] underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
