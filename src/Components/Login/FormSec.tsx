import { Link } from "react-router";
import HeroImg from "../../assets/Hero.jpeg"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const FormSec = () => {
    const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-md sm:max-w-lg md:max-w-xl">
        <div className="bg-white p-8 sm:p-10 shadow-md rounded-md">
          <h2 className="text-3xl font-bold mb-2 text-center text-[#093FB4]">
            Welcome Back!
          </h2>
          <div className="font-normal text-sm text-center mb-6">
            Sign in to continue to TicKenya
          </div>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4] focus:border-transparent transition-all duration-200"
            />
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#093FB4] focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer select-none z-10"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right m-1">
              <Link
                to="/forgot-password"
                className="text-sm text-[#093FB4] hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button className="btn bg-[#093FB4] text-white w-full hover:bg-[#093fb4cb]">
              Login
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-400 font-medium">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Google Sign-in */}
          <Link
            to="/dashboard"
            className="btn w-full border border-gray-300 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </Link>

          <p className="text-sm mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/dashboard"
              className="text-[#093FB4] underline font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
