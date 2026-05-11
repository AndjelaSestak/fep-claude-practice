import { useState } from 'react'
import { useMail } from '../../../hooks/useMail'
import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import FormWrapper from '../../../components/ui/FormWrapper'
import Input from '../../../components/ui/InputField'
import { forgotPasswordSchema } from '../../../schemas/mail'

const ForgotPasswordForm = () => {
  const { forgotPassword, isForgotPasswordPending } = useMail()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()

    const result = forgotPasswordSchema.safeParse({ email })
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    forgotPassword(result.data.email)
  }

  return (
    <FormWrapper className="max-w-md">
      <h2 className="text-2xl font-bold text-gray-900">Forgot password</h2>
      <p className="text-gray-500 text-sm mt-1 mb-6">
        Enter your email address and we will send you a reset link
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Email" required>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            error={errors.email}
          />
        </FormField>

        <Button type="submit" className="w-full mt-6" size="lg" disabled={isForgotPasswordPending}>
          {isForgotPasswordPending ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{' '}
        <a href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </a>
      </p>
    </FormWrapper>
  )
}

export default ForgotPasswordForm
