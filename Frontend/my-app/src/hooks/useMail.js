import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../services/authService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

export const useMail = () => {
  const navigate = useNavigate()

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success('If an account with that email exists, a password reset link has been sent.')
    },
    onError: () => {
      toast.error('Failed to send reset link. Please try again.')
    }
  })

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully. Please sign in with your new password.')
      navigate('/login')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to reset password. Please try again.'))
    }
  })

  return {
    forgotPassword: forgotPasswordMutation.mutate,
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    isResetPasswordPending: resetPasswordMutation.isPending
  }
}
