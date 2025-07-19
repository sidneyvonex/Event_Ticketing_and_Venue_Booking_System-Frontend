import { Routes, Route } from "react-router-dom";
import { AllEvents } from "../Components/Events/AllEvents";
import { EventDetails } from "../Components/Events/EventDetails";
import { Footer } from "../Components/Footer";
import { Topbar } from "../Components/Topbar";

export const Events = () => {
  return (
    <>
      <Topbar />
      <div className="pb-10">
        <Routes>
          {/* Main events page */}
          <Route index element={<AllEvents basePath="/events" />} />
          {/* Individual event details */}
          <Route path="/:eventId" element={<EventDetails />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};
