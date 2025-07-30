import { Footer } from "../Components/Footer";
import { Topbar } from "../Components/Topbar";
import { FaQuestionCircle, FaTicketAlt } from "react-icons/fa";

const HelpContent = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <div className="flex flex-col items-center mb-8">
      <FaQuestionCircle className="text-primary text-5xl mb-2" />
      <h1 className="text-3xl font-bold mb-2 text-primary text-center">
        Help & Support
      </h1>
      <p className="text-base-content/70 text-center max-w-lg">
        Welcome to our Help Center. Here you'll find answers to common questions
        about using our platform, booking events, payments, and getting support.
        If you can't find what you need, please contact us.
      </p>
    </div>

    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-base-content flex items-center gap-2">
        <FaTicketAlt className="text-primary" /> Frequently Asked Questions
      </h2>
      <div className="grid gap-4">
        <details className="group bg-base-100 rounded-xl border border-base-200 p-4 transition-shadow hover:shadow-lg">
          <summary className="font-medium cursor-pointer text-base-content group-open:text-primary transition">
            How do I book an event?
          </summary>
          <p className="mt-2 text-base-content/80">
            Go to the <span className="font-semibold">Events</span> page, select
            your desired event, choose the number of tickets, and follow the
            checkout process. You do not need to be logged in to browse events,
            but booking requires an account.
          </p>
        </details>
        <details className="group bg-base-100 rounded-xl border border-base-200 p-4 transition-shadow hover:shadow-lg">
          <summary className="font-medium cursor-pointer text-base-content group-open:text-primary transition">
            Do I need an account to book tickets?
          </summary>
          <p className="mt-2 text-base-content/80">
            Yes, you need to create an account or log in to book tickets. This
            helps us keep your bookings secure and allows you to manage your
            tickets easily.
          </p>
        </details>
        <details className="group bg-base-100 rounded-xl border border-base-200 p-4 transition-shadow hover:shadow-lg">
          <summary className="font-medium cursor-pointer text-base-content group-open:text-primary transition">
            What payment methods are accepted?
          </summary>
          <p className="mt-2 text-base-content/80">
            We accept M-Pesa, credit/debit cards, and other secure payment
            methods. All transactions are encrypted and secure.
          </p>
        </details>
        <details className="group bg-base-100 rounded-xl border border-base-200 p-4 transition-shadow hover:shadow-lg">
          <summary className="font-medium cursor-pointer text-base-content group-open:text-primary transition">
            How do I get my ticket after booking?
          </summary>
          <p className="mt-2 text-base-content/80">
            After successful payment, your ticket will be available in your
            account dashboard. You will also receive a confirmation email with
            your ticket details.
          </p>
        </details>
        <details className="group bg-base-100 rounded-xl border border-base-200 p-4 transition-shadow hover:shadow-lg">
          <summary className="font-medium cursor-pointer text-base-content group-open:text-primary transition">
            How do I contact support?
          </summary>
          <p className="mt-2 text-base-content/80">
            If you need help, email us at{" "}
            <a
              href="mailto:support@tickenya.com"
              className="text-primary underline"
            >
              support@tickenya.com
            </a>
            . Our team will respond as soon as possible.
          </p>
        </details>
      </div>
    </div>

    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-base-content">
        More Information
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-base-content/80">
        <li>
          <span className="font-semibold">Event Organizers:</span> If you want
          to list your event on our platform, please contact us at{" "}
          <a
            href="mailto:events@tickenya.com"
            className="text-primary underline"
          >
            events@tickenya.com
          </a>
          .
        </li>
        <li>
          <span className="font-semibold">Refund Policy:</span> Refunds are
          subject to event organizer policies. Please review event details or
          contact support for assistance.
        </li>
        <li>
          <span className="font-semibold">Privacy:</span> We value your privacy.
          Your information is kept secure and is never shared without your
          consent.
        </li>
      </ul>
    </div>

    <div className="text-center text-base-content/60 text-sm mt-8">
      <span>
        Can't find what you're looking for? Email us at{" "}
        <a
          href="mailto:support@tickenya.com"
          className="text-primary underline"
        >
          support@tickenya.com
        </a>
      </span>
    </div>
  </div>
);

export const Help = () => {
  return (
    <>
      <Topbar />
      <HelpContent />
      <Footer />
    </>
  );
};
