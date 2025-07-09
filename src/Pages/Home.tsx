import { Footer } from "../Components/Footer"
import { Blog } from "../Components/Home/Blog"
import { Hero } from "../Components/Home/Hero"
import { Stats } from "../Components/Home/Stats"
import { UpcomingEvents } from "../Components/Home/UpcomingEvents"
import { Topbar } from "../Components/Topbar"

export const Home = () => {
  return (
    <div>
        <Topbar/>
        <Hero/>
        <UpcomingEvents/>
        <Stats/>
        <Blog/>
        <Footer/>
    </div>
  )
}
