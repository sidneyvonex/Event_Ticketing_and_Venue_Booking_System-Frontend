import { Link } from "react-router";


export const UpcomingEvents = () => {
  return (
    <>
      <div className="">
        <div className="flex mb-0 ">
          <div className="navbar-start mx-10 my-5">
            <h1 className="font-bold">Upcoming Events</h1>
          </div>
          <div className="navbar-end mx-0">
            <Link to="/events" className="font-bold underline">
              More
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          <div className="card bg-base-100 w-80  rounded-2xl shadow-sm mb-5 ml-5 mt-5 hover:scale-103 transition duration-300">
            <figure className="pt-3 pl-2 pr-2">
              <img
                src="https://madfun.s3.af-south-1.amazonaws.com/What_it_Takes_-_Comrades_Edition_776.jpeg"
                alt="Event Picture Poster"
                className="rounded-t-xl"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">What It takes- Comrades Edition</h2>
              <p className="text-red-800">Wed 16 July, 2025 2:00 PM</p>
              <p className="text-gray-600">Kenya National Theatre</p>
              <div className="card-actions">
                <Link
                  to="/tickets"
                  className="btn btn-primary bg-[#093FB4] border-none rounded-lg text-white hover:bg-[#093fb4af]"
                >
                  Buy Ticket
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 w-80  rounded-2xl shadow-sm mb-5 ml-5 mt-5 hover:scale-103 transition duration-300">
            <figure className="pt-3 pl-2 pr-2">
              <img
                src="https://madfun.s3.af-south-1.amazonaws.com/What_it_Takes_-_Comrades_Edition_776.jpeg"
                alt="Event Picture Poster"
                className="rounded-t-xl"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">What It takes- Comrades Edition</h2>
              <p className="text-red-800">Wed 16 July, 2025 2:00 PM</p>
              <p className="text-gray-600">Kenya National Theatre</p>
              <div className="card-actions">
                <Link
                  to="/tickets"
                  className="btn btn-primary bg-[#093FB4] border-none rounded-lg text-white hover:bg-[#093fb4af]"
                >
                  Buy Ticket
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 w-80  rounded-2xl shadow-sm mb-5 ml-5 mt-5 hover:scale-103 transition duration-300">
            <figure className="pt-3 pl-2 pr-2">
              <img
                src="https://madfun.s3.af-south-1.amazonaws.com/What_it_Takes_-_Comrades_Edition_776.jpeg"
                alt="Event Picture Poster"
                className="rounded-t-xl"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">What It takes- Comrades Edition</h2>
              <p className="text-red-800">Wed 16 July, 2025 2:00 PM</p>
              <p className="text-gray-600">Kenya National Theatre</p>
              <div className="card-actions">
                <Link
                  to="/tickets"
                  className="btn btn-primary bg-[#093FB4] border-none rounded-lg text-white hover:bg-[#093fb4af]"
                >
                  Buy Ticket
                </Link>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 w-80  rounded-2xl shadow-sm mb-5 ml-5 mt-5 hover:scale-103 transition duration-300">
            <figure className="pt-3 pl-2 pr-2">
              <img
                src="https://madfun.s3.af-south-1.amazonaws.com/What_it_Takes_-_Comrades_Edition_776.jpeg"
                alt="Event Picture Poster"
                className="rounded-t-xl"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">What It takes- Comrades Edition</h2>
              <p className="text-red-800">Wed 16 July, 2025 2:00 PM</p>
              <p className="text-gray-600">Kenya National Theatre</p>
              <div className="card-actions">
                <Link
                  to="/tickets"
                  className="btn btn-primary bg-[#093FB4] border-none rounded-lg text-white hover:bg-[#093fb4af]"
                >
                  Buy Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
