import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queryKeys } from '../lib/queryKeys'
import { getMyCards, verifyCardPin } from '../services/cardService'
import { getSupportedCurrencies, createTransaction } from '../services/transactionService'
import { createTransactionSchema } from '../schemas/transactions'
import {
  getAccountNumberDigits,
  formatAccountNumber,
  ACCOUNT_NUMBER_LENGTH
} from '../utils/formatters'
import { EMPTY_FORM_TRANSACTION } from '../utils/constants'

export const useNewTransaction = ({ open, onClose, onSuccess }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState(EMPTY_FORM_TRANSACTION)
  const [pinDialogOpen, setPinDialogOpen] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [errors, setErrors] = useState({})

  const { data: cards = [] } = useQuery({
    queryKey: ['cards'],
    queryFn: getMyCards,
    enabled: open,
    select: (data) => data.map((c) => ({ value: String(c.id), label: c.card_number_masked })),
    onError: () => toast.error('Failed to load cards. Please try again.')
  })

  const { data: currencies = [] } = useQuery({
    queryKey: ['currencies'],
    queryFn: getSupportedCurrencies,
    enabled: open,
    onError: () => toast.error('Failed to load currencies. Please try again.')
  })

  const handleClose = () => {
    setFormData(EMPTY_FORM_TRANSACTION)
    setErrors({})
    setPendingFormData(null)
    setPinDialogOpen(false)
    onClose()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'recipient_account_number' ? formatAccountNumber(value) : value
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const transactionMutation = useMutation({
    mutationFn: async (pin) => {
      await verifyCardPin(parseInt(pendingFormData.card_id), pin)
      await createTransaction({
        card_id: parseInt(pendingFormData.card_id),
        amount: parseFloat(pendingFormData.amount),
        currency: pendingFormData.currency,
        recipient: pendingFormData.recipient,
        recipient_account_number: getAccountNumberDigits(pendingFormData.recipient_account_number),
        reference: pendingFormData.reference || null
      })
    },
    onSuccess: () => {
      setPinDialogOpen(false)
      setErrors({})
      setPendingFormData(null)
      toast.success('Your transaction has been submitted and is being processed.')
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list() })
      onClose()
      onSuccess?.()
    },
    onError: (err) => {
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
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const result = createTransactionSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors = {}

      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setPendingFormData(result.data)
    setPinDialogOpen(true)
  }

  return {
    formData,
    cards,
    currencies,
    loading: transactionMutation.isPending,
    pinDialogOpen,
    errors,
    setPinDialogOpen,
    handleChange,
    handleSubmit,
    handlePinConfirm: (pin) => transactionMutation.mutate(pin),
    handleClose
  }
}
