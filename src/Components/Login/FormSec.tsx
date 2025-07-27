/* eslint-disable @typescript-eslint/no-explicit-any */

import HeroImg from "../../assets/Hero.jpeg";
import { useState } from "react";
import { CheckCircle, Eye, EyeOff, LogIn, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { userApi } from "../../Features/api/userApi";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useDispatch } from "react-redux";
import type { UserLoginInputs } from "../../types/types";
import { setCredentials } from "../../Features/auth/authSlice";
import { Link } from "react-router-dom";
// Forgot password state


export const FormSec = () => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotPassword, { isLoading: forgotLoading }] =
    userApi.useForgotPasswordMutation();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    try {
      await forgotPassword(forgotEmail).unwrap();
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgot(false);
      setForgotEmail("");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to send reset email");
    }
  };
  const dispatch = useDispatch();

  const [loginUser, { isLoading: dataLoading }] =
    userApi.useLoginUserMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginInputs>();

  const [showPassword, setShowPassword] = useState(false);

  const formSubmit = async (data: UserLoginInputs) => {
    const loadingToastId = toast.loading("Logging in ....");
    try {
      const res = await loginUser(data).unwrap();
      console.log("🌟 ~ formSubmit ~ res:", res);
      toast.success(res.message, {
        id: loadingToastId,
        icon: <CheckCircle className="text-green-500 w-5 h-5" />,
      });
      dispatch(setCredentials(res));
      navigate("/redirect-dashboard");
    } catch (error: any) {
      console.log("🌟 Failed to Login:", error);
      toast.error("Failed to Login:  " + error.data?.error, {
        icon: <XCircle className="text-red-500 w-5 h-5" />,
      });
      toast.dismiss(loadingToastId);
    }
  };
  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      <Toaster richColors position="top-right" />
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-md sm:max-w-lg md:max-w-xl">
        <div className="bg-white p-8 sm:p-10 shadow-md rounded-md">
          <h2 className="text-3xl font-bold mb-2 text-center text-[#093FB4]">
            Welcome Back!
          </h2>
          <div className="font-normal text-sm text-center mb-6">
            Sign in to continue to TicKenya
          </div>

          {/* Login Form */}
          {!showForgot && (
            <form className="space-y-4" onSubmit={handleSubmit(formSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="text-md font-medium text-gray-800 mb-2 ml-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4] focus:border-transparent transition-all duration-200"
                  {...register("email", {
                    required: "Email is Required",
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="relative w-full">
                <label
                  htmlFor="password"
                  className="text-md font-medium text-gray-800 mb-2 ml-1"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="input input-bordered w-full border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#093FB4] focus:border-transparent transition-all duration-200"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <span className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer select-none z-10"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right m-1">
                <button
                  type="button"
                  className="text-sm text-[#093FB4] hover:underline font-medium bg-transparent border-none p-0"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
              </div>

              <button className="btn bg-[#093FB4] text-white w-full hover:bg-[#093fb4cb]">
                {dataLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                Login
              </button>
            </form>
          )}

          {/* Forgot Password Form */}
          {showForgot && (
            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div>
                <label
                  htmlFor="forgot-email"
                  className="text-md font-medium text-gray-800 mb-2 ml-1"
                >
                  Enter your email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4] focus:border-transparent transition-all duration-200"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowForgot(false)}
                  disabled={forgotLoading}
                >
                  Back to Login
                </button>
                <button
                  className="btn bg-[#093FB4] text-white hover:bg-[#093fb4cb]"
                  type="submit"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-400 font-medium">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/* Google Sign-in */}
          <Link
            to="/login"
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
              to="/register"
              className="text-[#093FB4] underline font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
