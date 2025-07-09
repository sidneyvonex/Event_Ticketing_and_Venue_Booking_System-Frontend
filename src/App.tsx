import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router'
import { Home } from './Pages/Home'
import { NotFound } from './Pages/NotFound'
import { Events } from './Pages/Events'

function App() {
const router = createBrowserRouter([
  {
    path:'/',
    element:<Home/>,
    errorElement:<NotFound/>
  },
  {
    path:'events',
    element:<Events/>,
    errorElement:<NotFound/>
  }
])

  return (

    <>
    <RouterProvider router = {router}/>
    </>
  )
}

export default App
