import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import Input from '../components/ui/InputField'
import FormWrapper from '../components/ui/FormWrapper'
import { authService } from '../services/authService'
import cardService from '../services/cardService'
import AlertDialog, {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '../components/ui/AlertDialog'

const OTPVerificationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const email = location.state?.email || ""
  const type = location.state?.type || ""
  const cardId = location.state?.cardId || ""

    // ERROR DIALOG
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // SUCCESS DIALOG
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const [resendDialogOpen, setResendDialogOpen] = useState(false)

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

  const handleResend = async (e) => {
    e.preventDefault()

    try{
         setLoading(true)
        await authService.resendVerificationEmail(email)
        setResendDialogOpen(true)
    }
    catch(err){
        const errorMessage = err.response?.data?.detail || "Failed to resend verification email. Please try again."
      setErrorMessage(errorMessage)
      setErrorDialogOpen(true)
    }finally {
      setLoading(false)
    }

  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pt-12">

        {/* SUCCESS DIALOG - Nakon uspešne verifikacije */}
    <AlertDialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
      <AlertDialogHeader>
        <AlertDialogTitle>Email Verified!</AlertDialogTitle>
        <AlertDialogDescription>
          Your email has been successfully verified. You can now access your dashboard.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>

    {/* RESEND DIALOG - Nakon ponovnog slanja koda */}
    <AlertDialog open={resendDialogOpen} onClose={() => setResendDialogOpen(false)}>
      <AlertDialogHeader>
        <AlertDialogTitle>Code Sent</AlertDialogTitle>
        <AlertDialogDescription>
          A new 6-digit verification code has been sent to <b>{email}</b>.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={() => setResendDialogOpen(false)}>
          Got it
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>

    {/* ERROR DIALOG */}
      <AlertDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>
            {errorMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setErrorDialogOpen(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>
      
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
                onClick={handleResend}
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