import Navbar from '../../components/layout/NavBar'
import AuthBrandLogo from '../../components/ui/AuthBrandLogo'
import LoginForm from './components/LoginForm'

const LoginPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <AuthBrandLogo />
      <LoginForm />
    </main>
  </div>
)

export default LoginPage
