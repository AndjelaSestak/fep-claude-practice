import { useContext } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import { register as apiRegister } from '../services/authService'

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
      const message = err?.response?.data?.detail || err?.message || 'Invalid email or password'
      toast.error(message)
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
      const message =
        err?.response?.data?.detail || err?.message || 'Registration failed. Please try again.'
      toast.error(message)
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
