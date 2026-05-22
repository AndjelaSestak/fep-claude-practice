import { useState } from 'react'
import { useSettings } from '../../../hooks/useSettings'
import FormWrapper from '../../../components/ui/FormWrapper'
import FormField from '../../../components/ui/FormField'
import Input from '../../../components/ui/InputField'
import Button from '../../../components/ui/Button'
import { changePasswordSchema } from '../../../schemas/settings'

const PasswordManagementForm = () => {
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  })
  const { changePassword, isChangePasswordPending } = useSettings()

  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handlePasswordSubmit = (event) => {
    event.preventDefault()
    const result = changePasswordSchema.safeParse(passwordData)
    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    changePassword(result.data)
  }

  return (
    <FormWrapper className="max-w-none">
      <div className="flex items-start gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Password Management</h3>
          <p className="text-sm text-gray-500">Update your password</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handlePasswordSubmit}>
        <FormField label="Current Password" required>
          <Input
            name="current_password"
            type="password"
            value={passwordData.current_password}
            onChange={handleChange}
            placeholder="Current Password"
            className="w-full"
            error={errors.current_password}
          />
        </FormField>

        <FormField label="New Password" required>
          <Input
            name="new_password"
            type="password"
            value={passwordData.new_password}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full"
            error={errors.new_password}
          />
        </FormField>

        <FormField label="Confirm New Password" required>
          <Input
            name="confirm_new_password"
            type="password"
            value={passwordData.confirm_new_password}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="w-full"
            error={errors.confirm_new_password}
          />
        </FormField>

        <div className="flex justify-end">
          <Button type="submit" size="sm" variant="default" disabled={isChangePasswordPending}>
            {isChangePasswordPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </FormWrapper>
  )
}

export default PasswordManagementForm
