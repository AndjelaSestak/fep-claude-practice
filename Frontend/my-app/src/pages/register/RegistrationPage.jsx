import Navbar from '../../components/layout/NavBar'
import RegistrationForm from './components/RegistrationForm'

const RegistrationPage = () => (
  <div className="min-h-screen bg-slate-100 flex flex-col">
    <Navbar />
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">SecureBank</h1>
        </div>
        <p className="mt-2 text-lg text-slate-600">Secure, modern banking platform</p>
      </div>
      <RegistrationForm />
    </main>
  </div>
)

export default RegistrationPage
