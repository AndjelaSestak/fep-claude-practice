import FormWrapper from '../../components/ui/FormWrapper'
import { OTPForm } from './components/OTPForm'
import { OTPFooter } from './components/OTPFooter'
import { useOTPVerification } from '../../hooks/useOTPVerification'

const OTPVerificationPage = () => {
  const otpData = useOTPVerification()

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pt-12">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">SecureBank</h1>
        </div>
        <p className="mt-2 text-lg text-slate-600">Secure, modern banking platform</p>
      </div>

      <FormWrapper>
        <div className="w-full">
          <div className="mb-8 text-left">
            <h2 className="text-4xl font-bold text-slate-900">Verify your email</h2>
            <p className="mt-2 text-lg text-slate-600">
              We sent a 6-digit code to{' '}
              <span className="font-medium text-slate-900">{otpData.email}</span>
            </p>
          </div>
          <OTPForm {...otpData} />
          <OTPFooter {...otpData} />
        </div>
      </FormWrapper>
    </div>
  )
}

export default OTPVerificationPage
