import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import SettingsHeader from './SettingsHeader'
import ProfileInformationForm from './ProfileInformationForm'
import FormWrapper from '../../components/ui/FormWrapper'
import FormField from '../../components/ui/FormField'
import Input from '../../components/ui/InputField'
import Button from '../../components/ui/Button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../../components/ui/AlertDialog'
import { Trash2 } from 'lucide-react'
import { changePassword, deleteUser } from '../../services/userService'

const SettingsPage = () => {
  const navigate = useNavigate()
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [alert, setAlert] = useState(null)

  const handleChange = (setter) => (event) => {
    const { name, value } = event.target

    setter((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      await changePassword(passwordData)
      setAlert({
        title: 'Password updated',
        description: 'Your password has been updated successfully.'
      })
    } catch (err) {
      setAlert({
        title: 'Update failed',
        description: err.response?.data?.detail || 'Failed to update password.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsSaving(true)

    try {
      await deleteUser()
      setAlert({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully.'
      })
      navigate('/')
    } catch (err) {
      setAlert({
        title: 'Deletion failed',
        description: err.response?.data?.detail || 'Failed to delete account.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
        <NavBarAfterLogin username="" />

        <div className="flex-1 bg-slate-50 flex flex-col px-8 pt-12 gap-8">
          {/* ZELENI HERO PANEL ZA PROFILE SETTINGS */}

          <SettingsHeader />

          <ProfileInformationForm />

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
                  onChange={handleChange(setPasswordData)}
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
                  onChange={handleChange(setPasswordData)}
                  placeholder="New Password"
                  className="w-full"
                />
              </FormField>

              <FormField label="Confirm New Password" required>
                <Input
                  name="confirm_new_password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.confirm_new_password}
                  onChange={handleChange(setPasswordData)}
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
                <Button type="submit" size="sm" variant="default" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>
          </FormWrapper>

          <FormWrapper className="border-red-200  max-w-none">
            <div className="flex items-start gap-4 mb-6">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-lg font-semibold">Account Menagement</h3>
                <p className="text-sm text-gray-500">Irreversible actions</p>
              </div>
            </div>

            {/* Button */}
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isSaving}
              onClick={handleDeleteAccount}
            >
              {isSaving ? 'Deleting...' : 'Delete account'}
            </Button>
          </FormWrapper>
        </div>

        <AlertDialog open={Boolean(alert)} onClose={() => setAlert(null)}>
          <AlertDialogHeader>
            <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
            <AlertDialogDescription>{alert?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlert(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      </div>
    </div>
  )
}

export default SettingsPage
