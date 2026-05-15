import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { resendVerificationEmail, verifyEmail } from '../services/authService'
import cardService from '../services/cardService'

export const useOTPVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [otp, setOtp] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const email = location.state?.email || ''
  const type = location.state?.type || ''
  const cardId = location.state?.cardId || ''

  useEffect(() => {
    if (!email) navigate('/register')
  }, [email, navigate])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const verifyMutation = useMutation({
    mutationFn: () =>
      type === 'card'
        ? cardService.verifyCard({ card_id: cardId, otp_code: otp })
        : verifyEmail({ email, otp_code: otp }),
    onSuccess: () => {
      if (type === 'card') {
        toast.success('Card verified! Check your email for card details.')
        navigate('/my_cards')
      } else {
        toast.success('Email verified successfully! Redirecting to login...')
        navigate('/login')
      }
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Invalid code')
  })

  const resendMutation = useMutation({
    mutationFn: () => resendVerificationEmail(email),
    onSuccess: () => {
      setResendCooldown(60)
      toast.info(`A new verification code has been sent to ${email}.`)
    },
    onError: (err) =>
      toast.error(err.response?.data?.detail || 'Failed to resend verification email.')
  })

  return {
    otp,
    setOtp,
    email,
    resendCooldown,
    loading: verifyMutation.isPending || resendMutation.isPending,
    error: verifyMutation.error?.response?.data?.detail || '',
    handleVerify: (e) => {
      e.preventDefault()
      verifyMutation.mutate()
    },
    handleResend: (e) => {
      e.preventDefault()
      resendMutation.mutate()
    }
  }
}
