import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { forgotPassword } from '../services/authService'

export const useMail = () => {
  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success('If an account with that email exists, a password reset link has been sent.')
    },
    onError: () => {
      toast.error('Failed to send reset link. Please try again.')
    }
  })

  return {
    forgotPassword: forgotPasswordMutation.mutate,
    isForgotPasswordPending: forgotPasswordMutation.isPending
  }
}
