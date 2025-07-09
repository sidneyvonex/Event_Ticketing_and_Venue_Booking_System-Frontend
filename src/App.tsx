import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router'
import { Home } from './Pages/Home'
import { NotFound } from './Pages/NotFound'

function App() {
const router = createBrowserRouter([
  {
    path:'/',
    element:<Home/>,
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
