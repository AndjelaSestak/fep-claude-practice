import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import Input from '../../../components/ui/InputField'
import { useNavigate } from 'react-router-dom'

export const OTPForm = ({ otp, setOtp, error, loading, handleVerify }) => {
  const navigate = useNavigate()

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <FormField label="Verification Code" required>
        <Input
          placeholder="000000"
          value={otp}
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

      <Button type="submit" size="lg" className="w-full mt-4" disabled={loading || otp.length < 6}>
        {loading ? 'Verifying...' : 'Verify Email'}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => navigate(-1)}
        disabled={loading}
      >
        Cancel
      </Button>
    </form>
  )
}
