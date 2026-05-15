import ForgotPasswordForm from './components/ForgotPasswordForm'
import AuthBrandLogo from '../../components/ui/AuthBrandLogo'

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <AuthBrandLogo />
      <ForgotPasswordForm />
    </div>
  )
}

export default ForgotPasswordPage
