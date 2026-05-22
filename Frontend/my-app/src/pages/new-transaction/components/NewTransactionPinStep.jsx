import { useState } from 'react'
import Button from '../../../components/ui/Button'
import InputField from '../../../components/ui/InputField'

const NewTransactionPinStep = ({ onConfirm, onBack, loading }) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  const handleConfirm = async () => {
    if (pin.length < 4) {
      setPinError('Please enter your 4-digit PIN.')
      return
    }
    setPinError('')
    try {
      await onConfirm(pin)
      setPin('')
    } catch (err) {
      const detail = err.response?.data?.detail
      setPinError(typeof detail === 'string' ? detail : 'Incorrect PIN. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-bold text-slate-900">Confirm Transaction</h2>
        <p className="mt-2 text-lg text-slate-600">
          Enter your 4-digit card PIN to confirm the payment.
        </p>
      </div>

      <InputField
        type="password"
        inputMode="numeric"
        maxLength={4}
        placeholder="****"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
        className="text-center text-2xl tracking-[0.5em] font-mono"
        autoFocus
      />
      {pinError && <p className="text-sm text-red-600 text-center">{pinError}</p>}

      <div className="flex flex-col gap-2">
        <Button onClick={handleConfirm} disabled={loading || pin.length < 4} className="w-full">
          {loading ? 'Verifying...' : 'Confirm Payment'}
        </Button>
        <Button variant="outline" onClick={onBack} disabled={loading} className="w-full">
          Back
        </Button>
      </div>
    </div>
  )
}

export default NewTransactionPinStep
