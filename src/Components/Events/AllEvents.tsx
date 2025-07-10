import {Link} from "react-router-dom"

export const AllEvents = () => {
  return (
    <div>
      <div className="py-5 max-w-full flex justify-center">
        <div className="join">
          <div>
            <div>
              <input className="input join-item" placeholder="Search" />
            </div>
          </div>
          <select className="select join-item">
            <option disabled selected>
              Filter
            </option>
            <option>Sci-fi</option>
            <option>Drama</option>
            <option>Action</option>
          </select>
          <div className="indicator">
            <button className="btn join-item">Search</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-10">
        <div className="card bg-white w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-102 transition duration-300">
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

        <div className="card bg-white w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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

        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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

        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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
        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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

        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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

        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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

        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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
        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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

        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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

        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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

        <div className="card bg-base-100 w-96  rounded-2xl shadow-sm mb-5 ml-5 hover:scale-105 transition duration-300">
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
  );
}
