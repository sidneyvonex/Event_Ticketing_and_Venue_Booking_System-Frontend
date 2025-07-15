import { AllEvents } from "../Components/Events/AllEvents"
import { Footer } from "../Components/Footer"
import { Topbar } from "../Components/Topbar"

export const Events = () => {
  return (
    <>
      <Topbar />
      <div className="pb-10">
        <AllEvents />
      </div>
      <Footer />
    </>
  );
}
