import Navbar from '../../components/layout/NavBar'
import Footer from '../../components/layout/Footer'
import HomeHero from './components/HomeHero'
import StatsSection from './components/StatsSection'
import FeaturesSection from './components/FeaturesSection'

const HomePage = () => (
  <div>
    <Navbar />
    <HomeHero />
    <StatsSection />
    <FeaturesSection />
    <Footer />
  </div>
)

export default HomePage
