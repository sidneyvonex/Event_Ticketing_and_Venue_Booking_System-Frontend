import { Topbar } from "../Components/Topbar";
import { Footer } from "../Components/Footer";
import { useForm } from "react-hook-form";
import ContactSVG from "../assets/contact us.svg";
import { Toaster, toast } from "sonner";

type ContactFormInputs = {
  name: string;
  email: string;
  message: string;
};

export const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormInputs>();

  const onSubmit = async () => {
    // Replace with your actual submission logic
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  };

  return (
    <>
      <Topbar />
      <Toaster position="top-right" richColors />
      <div className="min-h-screen flex flex-col justify-center">
        <div className="flex-1 flex flex-col md:flex-row gap-10 items-center max-w-6xl mx-auto py-10 px-4 w-full">
          {/* SVG Image Section */}
          <div className="w-full md:w-1/2 flex-shrink-0 mb-8 md:mb-0 flex justify-center items-center">
            <div
              className="rounded-3xl bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6 shadow-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl border-2 border-base-200"
              style={{ minHeight: 400, minWidth: 0 }}
            >
              <img
                src={ContactSVG}
                alt="Contact Illustration"
                className="w-full max-w-xl h-[400px] object-contain transition-transform duration-300"
                style={{ minHeight: 320, maxHeight: 420 }}
              />
            </div>
          </div>
          {/* Form & Info Section */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-4 text-primary">Contact Us</h1>
            <p className="mb-6 text-base-content/80">
              We'd love to hear from you! Please fill out the form below or use
              the provided contact details to reach our team.
            </p>
            <div className="bg-base-100 rounded-xl shadow p-6 mb-8 border border-base-200">
              <form
                className="space-y-4"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    className={`input input-bordered w-full ${
                      errors.name ? "input-error" : ""
                    }`}
                    type="text"
                    placeholder="Your Name"
                    {...register("name", { required: "Name is required" })}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <span className="text-error text-xs">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    className={`input input-bordered w-full ${
                      errors.email ? "input-error" : ""
                    }`}
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span className="text-error text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Message</label>
                  <textarea
                    className={`textarea textarea-bordered w-full ${
                      errors.message ? "textarea-error" : ""
                    }`}
                    rows={5}
                    placeholder="Type your message here..."
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                    })}
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.message && (
                    <span className="text-error text-xs">
                      {errors.message.message}
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-primary w-full"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                {isSubmitSuccessful && (
                  <div className="text-success text-sm mt-2 text-center">
                    Thank you for contacting us! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>
            <div className="bg-base-100 rounded-xl shadow p-6 border border-base-200">
              <h2 className="text-xl font-semibold mb-2">
                Contact Information
              </h2>
              <ul className="space-y-2 text-base-content/80">
                <li>
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href="mailto:support@tickenya.com"
                    className="text-primary underline"
                  >
                    support@tickenya.com
                  </a>
                </li>
                <li>
                  <span className="font-semibold">Phone:</span>{" "}
                  <a
                    href="tel:+254700000000"
                    className="text-primary underline"
                  >
                    +254 700 000 000
                  </a>
                </li>
                <li>
                  <span className="font-semibold">Address:</span> Nairobi, Kenya
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
