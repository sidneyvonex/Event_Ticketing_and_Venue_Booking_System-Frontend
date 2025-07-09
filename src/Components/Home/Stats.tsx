

export const Stats = () => {
  return (
    <div className=" bg-[#E5E0D8] pb-10">
      <div className="flex justify-center pt-10">
        <h1 className="font-bold text-3xl mb-5">About Our Success</h1>
      </div>
      <div className="flex items-center justify-center ">
        <div className="stats max-w-full gap-40">
          <div className="stat place-items-center">
            <div className="stat-value">
              120<span className="text-5xl">+</span>
            </div>
            <div className="stat-title text-[#ED3500] font-bold">
              Successful Events
            </div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-value text-secondary">
              20K <span className="text-5xl">+</span>
            </div>
            <div className="stat-title text-[#ED3500] font-bold">
              Successful Events
            </div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-value text-secondary">
              50K <span className="text-5xl">+</span>
            </div>
            <div className="stat-title text-[#ED3500] font-bold">
              Tickets Sold
            </div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-value text-secondary">
              20K <span className="text-5xl">+</span>
            </div>
            <div className="stat-title text-[#ED3500] font-bold">
              Active Users
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
