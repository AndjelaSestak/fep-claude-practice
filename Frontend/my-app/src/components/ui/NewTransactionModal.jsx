import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from './Dialog'
import FormField from './FormField'
import Input from './InputField'
import Select from './Select'
import Button from './Button'
import PinModal from './PinModal'
import { getMyCards, verifyCardPin } from '../../services/cardService'
import { getSupportedCurrencies, createTransaction } from '../../services/transactionService'
import { toast } from 'react-toastify'

const EMPTY_FORM = {
  card_id: '',
  amount: '',
  currency: '',
  recipient: '',
  recipient_account_number: '',
  reference: ''
}

const ACCOUNT_NUMBER_LENGTH = 16

const getAccountNumberDigits = (value) => value.replace(/\D/g, '').slice(0, ACCOUNT_NUMBER_LENGTH)

const formatAccountNumber = (value) =>
  getAccountNumberDigits(value)
    .replace(/(.{4})/g, '$1 ')
    .trim()

const NewTransactionModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [cards, setCards] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)

  const [pinDialogOpen, setPinDialogOpen] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)

  useEffect(() => {
    if (!open) return
    setFormData(EMPTY_FORM)

    const loadData = async () => {
      try {
        const [cardsData, currenciesData] = await Promise.all([
          getMyCards(),
          getSupportedCurrencies()
        ])
        setCards(
          cardsData.map((c) => ({
            value: String(c.id),
            label: c.card_number_masked
          }))
        )
        setCurrencies(currenciesData)
      } catch {
        toast.error('Failed to load form data. Please try again.')
      }
    }

    loadData()
  }, [open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'recipient_account_number' ? formatAccountNumber(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const recipientAccountNumber = getAccountNumberDigits(formData.recipient_account_number)
    if (recipientAccountNumber.length !== ACCOUNT_NUMBER_LENGTH) {
      toast.error('Recipient account number must contain exactly 16 digits.')
      return
    }

    setPendingFormData(formData)
    setPinDialogOpen(true)
  }

  const handlePinConfirm = async (pin) => {
    setLoading(true)
    try {
      await verifyCardPin(parseInt(pendingFormData.card_id), pin)
      setPinDialogOpen(false)
      await createTransaction({
        card_id: parseInt(pendingFormData.card_id),
        amount: parseFloat(pendingFormData.amount),
        currency: pendingFormData.currency,
        recipient: pendingFormData.recipient,
        recipient_account_number: getAccountNumberDigits(pendingFormData.recipient_account_number),
        reference: pendingFormData.reference || null
      })
      toast.success('Transaction submitted successfully!')
      onClose()
      onSuccess?.()
    } catch (err) {
      if (pinDialogOpen) throw err
      const data = err.response?.data
      let message = 'Something went wrong. Please try again.'
      if (Array.isArray(data?.detail)) {
        const seen = new Set()
        message = data.detail
          .map((e) => e.msg?.replace(/^Value error,\s*/i, '') || 'Invalid value')
          .filter((msg) => !seen.has(msg) && seen.add(msg))
          .join('\n')
      } else if (typeof data?.detail === 'string') {
        message = data.detail
      }
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogDescription>Fill in the details to send a new payment.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <FormField label="Card" required>
              <Select
                name="card_id"
                value={formData.card_id}
                onChange={handleChange}
                placeholder="Select a card"
                options={cards}
                required
              />
            </FormField>

            <div className="flex gap-4">
              <div className="flex-1">
                <FormField label="Amount" required>
                  <Input
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </FormField>
              </div>
              <div className="flex-1">
                <FormField label="Currency" required>
                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    placeholder="Select currency"
                    options={currencies}
                    required
                  />
                </FormField>
              </div>
            </div>

            <FormField label="Recipient" required>
              <Input
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="Full name of recipient"
                required
              />
            </FormField>

            <FormField label="Recipient Account Number" required>
              <Input
                name="recipient_account_number"
                value={formData.recipient_account_number}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                maxLength={19}
                required
              />
            </FormField>

            <FormField label="Reference">
              <Input
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Optional description"
              />
            </FormField>

            <DialogFooter>
              <DialogClose onClose={onClose}>Cancel</DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Payment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    
      <PinModal
        open={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        onConfirm={handlePinConfirm}
        loading={loading}
      />

    </>
  )
}

export default NewTransactionModal
