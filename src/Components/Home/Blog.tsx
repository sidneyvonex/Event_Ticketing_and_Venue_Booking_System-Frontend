

export const Blog = () => {
  return (
    <div className="bg-[#FFFFFF] pb-10 ml-20">
      <div className="flex justify-center pt-5 pb-3">
        <h1 className="text-2xl font-bold">Blogs</h1>
      </div>
      <div className="grid grid-cols-3 ">
        <div className="card bg-base-100 image-full w-96 rounded-xl hover:shadow-xl hover:scale-105 transition duration-300">
          <figure className="shadow-8xl">
            <img
              src="https://assets.citizen.digital/155290/conversions/Summertides-og_image.webp"
              alt="A Picture of People attending the Summer Tides"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-white">Inside Summer Tides</h2>
            <p className="text-white"> A Weekend of Sun, Sand and Saba Saba</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary bg-[#ED3500] rounded-xl text-white border-none hover:underline hover:bg-[#FF4F0F]">
                Read More
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 image-full w-96 rounded-xl hover:shadow-xl hover:scale-105 transition duration-300">
          <figure className="shadow-8xl">
            <img
              src="https://assets.citizen.digital/155290/conversions/Summertides-og_image.webp"
              alt="A Picture of People attending the Summer Tides"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-white">Inside Summer Tides</h2>
            <p className="text-white"> A Weekend of Sun, Sand and Saba Saba</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary bg-[#ED3500] rounded-xl text-white border-none hover:underline hover:bg-[#FF4F0F]">
                Read More
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 image-full w-96 rounded-xl hover:shadow-xl hover:scale-105 transition duration-300">
          <figure className="shadow-8xl">
            <img
              src="https://assets.citizen.digital/155290/conversions/Summertides-og_image.webp"
              alt="A Picture of People attending the Summer Tides"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-white">Inside Summer Tides</h2>
            <p className="text-white"> A Weekend of Sun, Sand and Saba Saba</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary bg-[#ED3500] rounded-xl text-white border-none hover:underline hover:bg-[#FF4F0F]">
                Read More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
