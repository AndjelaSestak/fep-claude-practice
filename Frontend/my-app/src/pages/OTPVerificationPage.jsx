import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import Input from '../components/ui/InputField'
import FormWrapper from '../components/ui/FormWrapper'
import { verifyEmail } from '../services/authService';

const OTPVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email || "";

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError("");
      
      await verifyEmail(email, otp);
      
      alert("Email verified successfully! You can now start managing your finances.");
      navigate('/dashboard'); 
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Something went wrong";
    setError(errorMessage);
    }finally {
    setLoading(false);
  }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pt-12">
      {/* Logo */}
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

          <div className="space-y-6">
            <FormField label="Verification Code" required>
              <Input
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </FormField>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              size="lg"
              className="w-full mt-4"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Didn't receive the code?{' '}
              <button className="font-medium text-primary hover:underline">
                Resend code
              </button>
            </p>

            <p className="text-center text-sm text-slate-600">
              Wrong email?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Go back
              </Link>
            </p>
          </div>
        </div>
      </FormWrapper>
    </div>
  )
}

export default OTPVerificationPage