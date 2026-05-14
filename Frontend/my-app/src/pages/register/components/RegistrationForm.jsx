import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import Input from '../../../components/ui/InputField'
import FormWrapper from '../../../components/ui/FormWrapper'
import { useAuth } from '../../../hooks/useAuth'
import { registerSchema } from '../../../schemas/auth'

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
  const [errors, setErrors] = useState({})

  const { register, isRegisterPending } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const result = registerSchema.safeParse(formData)
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
    register({ ...result.data, date_of_birth: result.data.date_of_birth || null })
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
            <Input name="name" value={formData.name} onChange={handleChange} error={errors.name} />
          </FormField>

          <FormField label="Email" required>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </FormField>

          <FormField label="City">
            <Input name="city" value={formData.city} onChange={handleChange} error={errors.city} />
          </FormField>

          <FormField label="Address">
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
          </FormField>

          <FormField label="Date of Birth">
            <Input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={errors.date_of_birth}
            />
          </FormField>

          <FormField label="Password" required>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </FormField>

          <FormField label="Confirm Password" required>
            <Input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password}
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
