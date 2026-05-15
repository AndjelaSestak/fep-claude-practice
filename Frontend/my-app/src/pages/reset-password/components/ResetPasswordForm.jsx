import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import FormWrapper from '../../../components/ui/FormWrapper'
import Input from '../../../components/ui/InputField'
import { useMail } from '../../../hooks/useMail'
import { resetPasswordSchema } from '../../../schemas/mail'

const missingTokenMessage =
  'Reset token was not found. Open the link from your email to reset your password.'

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { resetPassword, isResetPasswordPending } = useMail()
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    if (!token) {
      return
    }

    const result = resetPasswordSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors = {}

      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })

      setErrors(fieldErrors)
      toast.error('Please fix the errors before continuing.')
      return
    }

    resetPassword(
      {
        token,
        new_password: result.data.newPassword,
        confirm_new_password: result.data.confirmPassword
      },
      {
        onError: (err) => {
          const message =
            err?.response?.data?.detail || err?.message || 'Something went wrong. Please try again.'
          setErrors({ token: message })
        },
        onSuccess: () => {
          setFormData({ newPassword: '', confirmPassword: '' })
        }
      }
    )
  }

  const tokenError = !token ? missingTokenMessage : errors.token

  return (
    <FormWrapper className="max-w-md">
      <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
      <p className="text-gray-500 text-sm mt-1 mb-6">
        Enter a new password and confirm it. Your reset link must be valid.
      </p>

      {tokenError && <p className="text-red-500 text-sm mb-4">{tokenError}</p>}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <FormField label="New password" required>
          <Input
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
        </FormField>

        <FormField label="Confirm new password" required>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        </FormField>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!token || isResetPasswordPending}
        >
          {isResetPasswordPending ? 'Resetting password...' : 'Reset password'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </FormWrapper>
  )
}

export default ResetPasswordForm
