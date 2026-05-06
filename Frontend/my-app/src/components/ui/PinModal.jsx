import { useState, useEffect } from 'react'
import AlertDialog, {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from './AlertDialog'
import InputField from './InputField'

const PinModal = ({ open, onClose, onConfirm, loading }) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  useEffect(() => {
    if (open) {
      setPin('')
      setPinError('')
    }
  }, [open])

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
    <AlertDialog open={open} onClose={onClose}>
      <AlertDialogHeader>
        <AlertDialogTitle>Enter Card PIN</AlertDialogTitle>
        <AlertDialogDescription>
          Please enter your 4-digit card PIN to confirm the transaction.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="px-1 pb-2">
        <InputField
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="••••"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          className="text-center text-2xl tracking-[0.5em] font-mono"
          autoFocus
        />
        {pinError && <p className="mt-2 text-sm text-red-600 text-center">{pinError}</p>}
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleConfirm} disabled={loading || pin.length < 4}>
          {loading ? 'Verifying...' : 'Confirm'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  )
}

export default PinModal
