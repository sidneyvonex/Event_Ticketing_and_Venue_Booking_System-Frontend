import { AllEvents } from "../Components/Events/AllEvents"
import { Footer } from "../Components/Footer"
import { Topbar } from "../Components/Topbar"

export const Events = () => {
  return (
    <>
      <Topbar />
      <div className="bg-[#FFD8D8]">
        <AllEvents />
      </div>
      <Footer />
    </>
  );
}
