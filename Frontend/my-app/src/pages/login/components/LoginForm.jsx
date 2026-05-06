import { useState } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/InputField'
import { useAuth } from '../../../hooks/useAuth'
import { toast } from 'react-toastify'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoginPending } = useAuth()

  const handleLogin = () => {
    if (!email || !password) {
      toast.error('Please enter your email and password.')
      return
    }
    login({ email, password })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
      <p className="text-gray-500 text-sm mt-1 mb-6">
        Enter your email and password to access your account
      </p>

      <div className="mb-4">
        <Input
          label="Email"
          type="email"
          placeholder="admin@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <a href="/forgot_password" className="text-sm text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
      </div>

      <Button className="w-full" size="lg" onClick={handleLogin} disabled={isLoginPending}>
        {isLoginPending ? 'Signing in...' : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <a href="/register" className="text-primary font-medium hover:underline">
          Sign up
        </a>
      </p>
    </div>
  )
}

export default LoginForm
