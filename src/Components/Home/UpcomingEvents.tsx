import { Link } from "react-router";


export const UpcomingEvents = () => {
  return (
    <>
      <div>
        <div className="flex mb-0">
          <div className="navbar-start mx-10 my-5">
            <h1 className="font-bold">Upcoming Events</h1>
          </div>
          <div className="navbar-end mx-10 my-5">
            <h1 className="font-bold underline">More</h1>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5">
            <figure className="px-10 pt-10">
              <img
                src="https://madfun.s3.af-south-1.amazonaws.com/What_it_Takes_-_Comrades_Edition_776.jpeg"
                alt="Event Picture Poster"
                className="rounded-xl"
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

          <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5">
            <figure className="px-10 pt-10">
              <img
                src="https://madfun.s3.af-south-1.amazonaws.com/What_it_Takes_-_Comrades_Edition_776.jpeg"
                alt="Event Picture Poster"
                className="rounded-xl"
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

          <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5">
            <figure className="px-10 pt-10">
              <img
                src="https://madfun.s3.af-south-1.amazonaws.com/What_it_Takes_-_Comrades_Edition_776.jpeg"
                alt="Event Picture Poster"
                className="rounded-xl"
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

          <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5">
            <figure className="px-10 pt-10">
              <img
                src="https://madfun.s3.af-south-1.amazonaws.com/What_it_Takes_-_Comrades_Edition_776.jpeg"
                alt="Event Picture Poster"
                className="rounded-xl"
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
