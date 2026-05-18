import { CreditCard } from 'lucide-react'

const AuthBrandLogo = ({ subtitle = 'Secure, modern banking platform' }) => (
  <div className="flex flex-col items-center mb-8">
    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
      <CreditCard className="w-8 h-8 text-white" />
    </div>
    <h1 className="text-2xl font-bold text-gray-900">SecureBank</h1>
    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
  </div>
)

export default AuthBrandLogo
