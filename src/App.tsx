import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router'
import { Home } from './Pages/Home'
import { NotFound } from './Pages/NotFound'
import { Events } from './Pages/Events'
import { Login } from './Pages/Login'
import { Register } from './Pages/Register'
import { Contact } from './Pages/Contact'
import { Help } from './Pages/Help'
import { Blog } from './Pages/Blog'
import { UserDashboard } from './Pages/UserDashboard'
import { Profile } from './Pages/Profile'
import { SupportTicket } from './Pages/Support'
import  ProtectedRoutes from './Components/Home/ProtectedRoutes'
import { AllEvents } from './Components/Events/AllEvents'
import { UserBookings } from './Components/UserDashboard/UserBookings'
import { Dashboard } from './Components/UserDashboard/Overview/Overview'
import { UserPaymentsPage } from './Components/UserDashboard/UserPaymentsPage'

function App() {
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "events",
    element: <Events />,
    errorElement: <NotFound />,
  },
  {
    path: "login",
    element: <Login />,
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
        index: true, //
        element: <Dashboard />, //Default Dashboard Panel
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "bookings",
        element: <UserBookings />,
      },
      {
        path: "payments",
        element: <UserPaymentsPage/>,
      },
      {
        path: "events",
        element: <AllEvents />,
      },
      {
        path: "support",
        element: <SupportTicket />,
      },
    ],
  },
]);

  return (

    <>
    <RouterProvider router = {router}/>
    </>
  )
}

export default App
