import { useState } from 'react'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import Input from '../components/ui/InputField'
import { Link, useNavigate } from 'react-router-dom'
import FormWrapper from '../components/ui/FormWrapper'
import { register } from '../services/authService'
import Navbar from '../components/layout/NavBar'

import AlertDialog, {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '../components/ui/AlertDialog'

const RegistrationPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    address: '',
    date_of_birth: '',
    password: '',
    confirm_password: ''
  })

  const [loading, setLoading] = useState(false)

  // ERROR DIALOG
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // SUCCESS DIALOG
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      await register({
        ...formData,
        date_of_birth: formData.date_of_birth || null
      })

      setSuccessDialogOpen(true)
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Registration failed. Please try again.')
      setErrorDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      {/* SUCCESS DIALOG */}
      <AlertDialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Account created </AlertDialogTitle>
          <AlertDialogDescription>
            Your account has been successfully created. You will be redirected to email
            verification.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setSuccessDialogOpen(false)
              navigate('/verify_email', {
                state: { email: formData.email }
              })
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* ERROR DIALOG */}
      <AlertDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Registration failed</AlertDialogTitle>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setErrorDialogOpen(false)}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>

      <main className="flex flex-1 flex-col items-center px-4 py-12">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="rounded-lg bg-primary p-2">
              <span className="text-lg font-bold text-white">S</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">SecureBank</h1>
          </div>
          <p className="mt-2 text-lg text-slate-600">Secure, modern banking platform</p>
        </div>

        {/* FORM */}
        <FormWrapper>
          <div className="w-full">
            <div className="mb-8 text-left">
              <h2 className="text-4xl font-bold text-slate-900">Create an account</h2>
              <p className="mt-2 text-lg text-slate-600">
                Enter your details to create your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Full Name" required>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </FormField>

              <FormField label="Email" required>
                <Input name="email" value={formData.email} onChange={handleChange} />
              </FormField>

              <FormField label="City">
                <Input name="city" value={formData.city} onChange={handleChange} />
              </FormField>

              <FormField label="Address">
                <Input name="address" value={formData.address} onChange={handleChange} />
              </FormField>

              <FormField label="Date of Birth">
                <Input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormField>

              <FormField label="Confirm Password" required>
                <Input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </FormField>

              <div className="flex flex-col gap-2 mt-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-slate-600 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </FormWrapper>
      </main>
    </div>
  )
}
export default RegistrationPage
