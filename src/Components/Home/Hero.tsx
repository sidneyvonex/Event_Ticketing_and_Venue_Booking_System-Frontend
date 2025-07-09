import HeroImg from "../../assets/Hero.jpeg"

export const Hero = () => {
  return (
    <>
      <div>
        <div
          className="h-[60vh] bg-cover bg-center bg-no-repeat relative flex items-center justify-center "
          style={{ backgroundImage: `url(${HeroImg})` }}
        >
          <div className="bg-white/40 backdrop-blur-sm rounded shadow-lg w-full max-w-md mx-auto p-6">
            <div className="flex justify-center mb-4">
              <button className="px-4 py-0 text-[#ED3500] border-t-2 border-[#ED3500] font-semibold">
                Events
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Name..."
                className="border border-gray-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Venue"
                className="border border-gray-500 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6">
              <button className="bg-[#ED3500] w-full text-white py-2 rounded hover:opacity-80 transition cursor-pointer">
                Find Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
