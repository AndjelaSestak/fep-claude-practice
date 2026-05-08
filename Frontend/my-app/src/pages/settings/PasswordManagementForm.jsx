import { useState } from 'react'
import { useSettings } from '../../hooks/useSettings'
import FormWrapper from '../../components/ui/FormWrapper'
import FormField from '../../components/ui/FormField'
import Input from '../../components/ui/InputField'
import Button from '../../components/ui/Button'

const PasswordManagementForm = () => {
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const { changePassword, isChangePasswordPending } = useSettings()

  const handleChange = (event) => {
    const { name, value } = event.target

    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = (event) => {
    event.preventDefault()
    changePassword(passwordData)
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
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={handleChange}
                  placeholder="Current Password"
                  className="w-full"
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showCurrentPassword}
                    onChange={(event) => setShowCurrentPassword(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Show current password
                </label>
              </FormField>

              <FormField label="New Password" required>
                <Input
                  name="new_password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="w-full"
                />
              </FormField>

              <FormField label="Confirm New Password" required>
                <Input
                  name="confirm_new_password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.confirm_new_password}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  className="w-full"
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={showNewPassword}
                    onChange={(event) => setShowNewPassword(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  Show new password
                </label>
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
