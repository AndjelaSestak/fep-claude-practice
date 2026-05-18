import AuthBrandLogo from '../../components/ui/AuthBrandLogo'
import ResetPasswordForm from './components/ResetPasswordForm'

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <AuthBrandLogo subtitle="Reset password for your account" />
      <ResetPasswordForm />
    </div>
  )
}

export default ResetPasswordPage
