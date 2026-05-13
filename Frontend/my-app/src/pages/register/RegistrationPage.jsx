import Navbar from '../../components/layout/NavBar'
import AuthBrandLogo from '../../components/ui/AuthBrandLogo'
import RegistrationForm from './components/RegistrationForm'

const RegistrationPage = () => (
  <div className="min-h-screen bg-slate-100 flex flex-col">
    <Navbar />
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <AuthBrandLogo />
      <RegistrationForm />
    </main>
  </div>
)

export default RegistrationPage
