import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuth } from './useAuth'
import { useNavigate } from 'react-router-dom'
import { changePassword, updateCurrentUser, deleteUser } from '../services/userService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'


export const useSettings = () => {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const updateProfileMutation = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: async () => {
      await refreshUser()
      toast.success('Profile updated successfully!')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update profile.'))
    }
  })

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password updated successfully!')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update password.'))
    }
  })

  const deleteAccountMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('Account deleted successfully!')
      navigate('/')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete account.'))
    }
  })

  return {
    user,
    updateProfile: updateProfileMutation.mutate,
    isUpdateProfilePending: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangePasswordPending: changePasswordMutation.isPending,
    deleteAccount: deleteAccountMutation.mutate,
    isDeleteAccountPending: deleteAccountMutation.isPending

  }
}
