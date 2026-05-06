import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import Input from '../../../components/ui/InputField'
import FormWrapper from '../../../components/ui/FormWrapper'
import { useAuth } from '../../../hooks/useAuth'

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    address: '',
    date_of_birth: '',
    password: '',
    confirm_password: ''
  })

  const { register, isRegisterPending } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.confirm_password) {
      toast.error('Please fill in all required fields.')
      return
    }

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match.')
      return
    }

    register({ ...formData, date_of_birth: formData.date_of_birth || null })
  }

  return (
    <FormWrapper>
      <div className="w-full">
        <div className="mb-8 text-left">
          <h2 className="text-4xl font-bold text-slate-900">Create an account</h2>
          <p className="mt-2 text-lg text-slate-600">Enter your details to create your account</p>
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
            <Button type="submit" className="w-full" disabled={isRegisterPending}>
              {isRegisterPending ? 'Creating account...' : 'Create account'}
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
  )
}

export default RegistrationForm
