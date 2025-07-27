/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import HeroImg from "../../assets/Hero.jpeg";
import { useState } from "react";
import { CheckCircle, Eye, EyeOff, UserPlus, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../Features/api/userApi";

interface UserInputs {
  firstName: string;
  lastName: string;
  email: string;
  contactPhone: string;
  password: string;
  confirmPassword: string;
  address: string;
}

export const RegisterForm = () => {
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserInputs>();

  const password = watch("password");

  const getPasswordStrength = (password: string) => {
    if (!password) return "";
    const strong = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/;
    const medium = /(?=.*[a-zA-Z])(?=.*\d).{6,}/;
    if (strong.test(password)) return "Strong";
    if (medium.test(password)) return "Medium";
    return "Weak";
  };

  const strength = getPasswordStrength(password);

  //Navigation
  const navigate = useNavigate();

  // User Api Logic

  const [registerUser, { isLoading }] = userApi.useRegisterUserMutation();

  const formSubmit = async (data: UserInputs) => {
    const loadingToastId = toast.loading("Creating Account");
    try {
      const res = await registerUser(data).unwrap();

      console.log("🌟 ~ formSubmit ~ res:", res);

      toast.success(res.message, {
        id: loadingToastId,
        icon: <CheckCircle className="text-green-500 w-5 h-5" />,
      });
      navigate("/login");
    } catch (error: any) {
      console.log("🌟 Failed to Register:", error);
      toast.error(
        "Failed to register:  " +
          (error?.data?.error ||
            error?.data?.message ||
            error?.message ||
            "Unknown error"),
        {
          icon: <XCircle className="text-red-500 w-5 h-5" />,
        }
      );
      toast.dismiss(loadingToastId);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      <Toaster richColors position="top-right" />
      <div className="flex items-center justify-center w-full max-w-lg px-1">
        <div className="bg-white p-4 sm:p-8 shadow-md rounded-md w-full">
          <h2 className="text-3xl font-bold mb-2 text-center text-[#093FB4]">
            Create Account
          </h2>
          <p className="text-sm text-center text-gray-600 mb-6">
            Fill in the details to register
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(formSubmit)}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="text-md font-medium text-gray-800"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
                  {...register("firstName", {
                    required: "First Name is Required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="text-md font-medium text-gray-800"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
                  {...register("lastName", {
                    required: "Last Name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="email"
                className="text-md font-medium text-gray-800"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
                {...register("email", {
                  required: "Email is required",
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
                className="text-md font-medium text-gray-800"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="input input-bordered w-full pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
                {...register("password", {
                  required: "Password required",
                  validate: (value) => {
                    const strongRegex =
                      /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/;
                    return strongRegex.test(value)
                      ? true
                      : "Password must be strong (8+ chars, upper, lower, number, symbol)";
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Optional: Display password requirements */}
            <ul className="text-xs text-gray-500 list-disc ml-4 mt-1">
              <li>At least 8 characters</li>
              <li>1 uppercase & lowercase letter</li>
              <li>1 number</li>
              <li>1 special character (@$!%*?&)</li>
            </ul>

            <p className="text-sm font-medium text-gray-600">
              Password Strength:{" "}
              <span
                className={`font-bold ${
                  strength === "Strong"
                    ? "text-green-600"
                    : strength === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {strength}
              </span>
            </p>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="text-md font-medium text-gray-800"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="input input-bordered w-full pr-10 border border-gray-300 rounded-md"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-[55%] transform -translate-y-1/2 text-gray-500 cursor-pointer z-10"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="contactPhone"
                className="text-md font-medium text-gray-800"
              >
                Phone Number
              </label>
              <input
                id="contactPhone"
                type="tel"
                placeholder="07 XXXXXX"
                className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
                {...register("contactPhone", {
                  required: "Phone number required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid Phone Number",
                  },
                })}
              />
              {errors.contactPhone && (
                <span className="text-red-600 text-sm mt-1">
                  {errors.contactPhone.message}
                </span>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="address"
                className="text-md font-medium text-gray-800"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="Address"
                className="input input-bordered w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && (
                <span className="text-red-600 text-sm mt-1">
                  {errors.address.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="btn w-full text-white bg-[#093FB4] hover:bg-[#093fb4cb]"
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
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
