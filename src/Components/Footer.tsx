import { Link } from "react-router";
import Logo from "../assets/Logo.svg"

export const Footer = () => {
  return (
    <>
      <footer className="footer sm:footer-horizontal text-base-content p-8 bg-[#FFD8D8]">
        <aside>
          <div className="flex">
            <img src={Logo} alt="TicKenya Logo" />
            <p className="text-black text-2xl font-semibold">
              Tic<span className="text-[#ED3500]">Kenya</span> 
            </p>
          </div>
          <p>
            Lorem ipsum, dolor sit a <br />
            adipisicin
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Pages</h6>
          <Link to="/events" className="link link-hover">
            Events
          </Link>
          <Link to="/terms" className="link link-hover">
            Terms and Conditions
          </Link>
          <Link to="/policy" className="link link-hover">
            Privacy Policy
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Using TicKenya</h6>
          <Link to="/events" className="link link-hover">
            Buy a Ticket
          </Link>
          <Link to="/help" className="link link-hover">
            How to Buy a Ticket
          </Link>
          <Link to="/reveiw" className="link link-hover">
            Write a Review
          </Link>
        </nav>
        <form>
          <h6 className="footer-title">Newsletter</h6>
          <fieldset className="w-80">
            <label>Enter your email address</label>
            <div className="join">
              <input
                type="text"
                placeholder="johndoe@email.com"
                className="input join-item border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              />
              <button className="btn btn-primary join-item border-none bg-[#093FB4] rounded">
                Subscribe
              </button>
            </div>
          </fieldset>
        </form>
      </footer>
      <div className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            TicKenya Ltd
          </p>
        </aside>
      </div>
    </>
  );
}
