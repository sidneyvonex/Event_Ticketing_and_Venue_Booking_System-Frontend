import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Home } from "./Pages/Home";
import { NotFound } from "./Pages/NotFound";
import { Events } from "./Pages/Events";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { Contact } from "./Pages/Contact";
import { Help } from "./Pages/Help";
import { Blog } from "./Pages/Blog";
import { UserDashboard } from "./Pages/UserDashboard";
import { AdminDashboard } from "./Pages/AdminDashboard";
import { UserProfile } from "./Components/UserDashboard/UserProfile";
import { UserSupport } from "./Components/UserDashboard/UserSupport";
import ProtectedRoutes from "./Components/Home/ProtectedRoutes";
import { AllEvents } from "./Components/Events/AllEvents";
import { UserBookings } from "./Components/UserDashboard/UserBookings";
import { UserDashboardOverview } from "./Components/UserDashboard/UserDashboardOverview";
import { UserPaymentsPage } from "./Components/UserDashboard/UserPaymentsPage";
import { EventDetails } from "./Components/Events/EventDetails";
import { AdminDashboardOverview } from "./Components/AdminDashboard/AdminDashboardOverview";
import { AllBookings } from "./Components/AdminDashboard/AllBookings";
import { AllPayments } from "./Components/AdminDashboard/AllPayments";
import { AllVenues } from "./Components/AdminDashboard/AllVenues";
import { AllSupportTickets } from "./Components/AdminDashboard/AllSupportTickets";
import { AdminProfile } from "./Components/AdminDashboard/AdminProfile";
import { RoleBasedRedirect } from "./Components/Home/RoleBasedRedirect";
import { AdminEvents } from "./Components/AdminDashboard/AdminEvents";

import SalesReport from "./Components/AdminDashboard/SalesReport";
import { AllUsers } from "./Components/AdminDashboard/AllUsers";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFound />,
    },
    {
      path: "events/*",
      element: <Events />,
      errorElement: <NotFound />,
    },
    {
      path: "login",
      element: <Login />,
      errorElement: <NotFound />,
    },
    {
      path: "redirect-dashboard",
      element: <RoleBasedRedirect />,
      errorElement: <NotFound />,
    },
    {
      path: "register",
      element: <Register />,
      errorElement: <NotFound />,
    },
    {
      path: "contact",
      element: <Contact />,
      errorElement: <NotFound />,
    },
    {
      path: "blogs",
      element: <Blog />,
      errorElement: <NotFound />,
    },
    {
      path: "help",
      element: <Help />,
      errorElement: <NotFound />,
    },
    {
      path: "/dashboard/",
      element: (
        <ProtectedRoutes>
          <UserDashboard />
        </ProtectedRoutes>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <UserDashboardOverview />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
        {
          path: "bookings",
          element: <UserBookings />,
        },
        {
          path: "payments",
          element: <UserPaymentsPage />,
        },
        {
          path: "events",
          children: [
            {
              index: true,
              element: <AllEvents basePath="/dashboard/events" />,
            },
            {
              path: ":eventId",
              element: <EventDetails />,
            },
          ],
        },
        {
          path: "support",
          element: <UserSupport />,
        },
      ],
    },
    {
      path: "/admindashboard",
      element: (
        <ProtectedRoutes>
          <AdminDashboard />
        </ProtectedRoutes>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <AdminDashboardOverview />,
        },
        {
          path: "profile",
          element: <AdminProfile />,
        },
        {
          path: "bookings",
          element: <AllBookings />,
        },
        {
          path: "payments",
          element: <AllPayments />,
        },
        {
          path: "venues",
          element: <AllVenues />,
        },
        {
          path: "events",
          children: [
            {
              index: true,
              element: <AdminEvents />,
            },
            {
              path: ":eventId",
              element: <EventDetails />,
            },
          ],
        },
        {
          path: "support",
          element: <AllSupportTickets />,
        },
        {
          path: "reports",
          element: <SalesReport />,
        },
        {
          path: "users",
          element: <AllUsers />,
        },
        {
          path: "settings",
          element: (
            <div className="p-6">
              <h1 className="text-2xl font-bold">Admin Settings</h1>
              <p>Settings component coming soon...</p>
            </div>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
