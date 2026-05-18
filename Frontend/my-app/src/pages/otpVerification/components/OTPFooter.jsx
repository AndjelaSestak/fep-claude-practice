import { Link } from 'react-router-dom'

export const OTPFooter = ({ resendCooldown, loading, handleResend }) => {
  return (
    <div className="mt-8 space-y-4">
      <p className="text-center text-sm text-slate-600">
        Didn't receive the code?{' '}
        <button
          type="button"
          className="font-medium text-primary hover:underline transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
          onClick={handleResend}
          disabled={resendCooldown > 0 || loading}
        >
          {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
        </button>
      </p>
      <p className="text-center text-sm text-slate-600">
        Wrong email?{' '}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Go back to registration
        </Link>
      </p>
    </div>
  )
}
