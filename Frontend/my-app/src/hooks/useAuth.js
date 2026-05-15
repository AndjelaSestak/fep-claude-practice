import { useContext } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { register as apiRegister } from '../services/authService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    loading,
    login: contextLogin,
    logout: contextLogout,
    refreshUser
  } = useContext(AuthContext)
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => contextLogin(email, password),
    onSuccess: () => {
      toast.success('Welcome back!')
      navigate('/dashboard')
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Invalid email or password'))
    }
  })

  const logoutMutation = useMutation({
    mutationFn: contextLogout,
    onSuccess: () => navigate('/login'),
    onError: () => toast.error('Failed to log out. Please try again.')
  })

  const registerMutation = useMutation({
    mutationFn: apiRegister,
    onSuccess: (_, variables) => {
      toast.success('Account created! Please verify your email.')
      navigate('/verify_email', { state: { email: variables.email } })
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Registration failed. Please try again.'))
    }
  })

  return {
    user,
    isAuthenticated,
    loading,
    refreshUser,
    login: loginMutation.mutate,
    isLoginPending: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLogoutPending: logoutMutation.isPending,
    register: registerMutation.mutate,
    isRegisterPending: registerMutation.isPending
  }
}
