import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from './Dialog'
import Button from './Button'
import InputField from './InputField'

const PinModal = ({ open, onClose, onConfirm, loading }) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  const handleClose = () => {
    setPin('')
    setPinError('')
    onClose()
  }

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
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Card PIN</DialogTitle>
          <DialogDescription>
            Please enter your 4-digit card PIN to confirm the transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="px-1 pb-2 mt-6">
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
          {pinError && <p className="mt-2 text-sm text-red-600 text-center">{pinError}</p>}
        </div>

        <DialogFooter>
          <DialogClose onClose={handleClose}>Cancel</DialogClose>
          <Button type="button" onClick={handleConfirm} disabled={loading || pin.length < 4}>
            {loading ? 'Verifying...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PinModal
