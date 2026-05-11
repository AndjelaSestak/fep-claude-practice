import Navbar from '../../components/layout/NavBar'
import Footer from '../../components/layout/Footer'
import AboutHero from './components/AboutHero'
import AboutStory from './components/AboutStory'
import AboutEducational from './components/AboutEducational'

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <AboutStory />
        <AboutEducational />
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
