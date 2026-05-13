import Navbar from '../../components/layout/NavBar'
import Footer from '../../components/layout/Footer'
import TeamHero from './components/TeamHero'
import LeadershipTeam from './components/LeadershipTeam'

const TeamPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <TeamHero />
        <LeadershipTeam />
      </main>
      <Footer />
    </div>
  )
}

export default TeamPage
