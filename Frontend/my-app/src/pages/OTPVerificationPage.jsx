import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import Input from '../components/ui/InputField'
import FormWrapper from '../components/ui/FormWrapper'
import { authService } from '../services/authService'
import cardService from '../services/cardService'

const OTPVerificationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const email = location.state?.email || ""
  const type = location.state?.type || ""
  const cardId = location.state?.cardId || ""

  // Zaštita: Ako nema email-a (npr. refresh stranice), vrati korisnika na registraciju
  useEffect(() => {
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  const handleVerify = async (e) => {
  e.preventDefault()

  try {
    setLoading(true)
    setError("")

    if (type === 'card') {
      await cardService.verifyCard({
        card_id: cardId,
        otp_code: otp
      })
      navigate('/my-cards')
    } else {
      await authService.verifyEmail({
        email,
        otp_code: otp
      })
      navigate('/dashboard')
    }
    
  } catch (err) {
    setError(err.response?.data?.detail || "Invalid code")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pt-12">
      {/* HEADER / LOGO */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">SecureBank</h1>
        </div>
        <p className="mt-2 text-lg text-slate-600">
          Secure, modern banking platform
        </p>
      </div>

      <FormWrapper>
        <div className="w-full">
          <div className="mb-8 text-left">
            <h2 className="text-4xl font-bold text-slate-900">
              Verify your email
            </h2>
            <p className="mt-2 text-lg text-slate-600">
              We sent a 6-digit code to{' '}
              <span className="font-medium text-slate-900">{email}</span>
            </p>
          </div>

          {/* Koristimo formu kako bi funkcionisao "Submit on Enter" */}
          <form onSubmit={handleVerify} className="space-y-6">
            <FormField label="Verification Code" required>
              <Input
                placeholder="000000"
                value={otp}
                // Dozvoljavamo samo brojeve i limitiramo na 6 karaktera
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono"
                maxLength={6}
                disabled={loading}
              />
            </FormField>

            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 text-center font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full mt-4"
              disabled={loading || otp.length < 6}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <p className="text-center text-sm text-slate-600">
              Didn't receive the code?{' '}
              <button 
                type="button"
                className="font-medium text-primary hover:underline transition-all"
                onClick={() => alert("Code resent!")}
              >
                Resend code
              </button>
            </p>

            <p className="text-center text-sm text-slate-600">
              Wrong email?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Go back to registration
              </Link>
            </p>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}

export default OTPVerificationPage