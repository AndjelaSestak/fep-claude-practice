import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/InputField'
import { useAuth } from '../../../hooks/useAuth'
import { loginSchema } from '../../../schemas/auth'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const { login, isLoginPending } = useAuth()

  const handleLogin = () => {
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      toast.error('Please fix the errors before continuing.')
      return
    }
    setErrors({})
    login(result.data)
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
          onChange={(e) => {
            setEmail(e.target.value)
            setErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={errors.email}
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
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          error={errors.password}
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
