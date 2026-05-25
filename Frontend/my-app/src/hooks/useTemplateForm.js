import { useState, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryKeys'
import { getMyCards, verifyCardPin } from '../services/cardService'
import { getSupportedCurrencies } from '../services/transactionService'
import { createTemplate, updateTemplate } from '../services/templateService'
import {
  getAccountNumberDigits,
  formatAccountNumber,
  ACCOUNT_NUMBER_LENGTH
} from '../utils/formatters'
import { FREQUENCIES, EMPTY_FORM_TEMPLATES } from '../utils/constants'

const padDatePart = (value) => String(value).padStart(2, '0')

export const toDatetimeLocalValue = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return (
    [date.getFullYear(), padDatePart(date.getMonth() + 1), padDatePart(date.getDate())].join('-') +
    `T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`
  )
}

const toUTCISOString = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

const templateToForm = (t) => ({
  name: t.name ?? '',
  type: t.type ?? 'single',
  recipient: t.recipient ?? '',
  recipient_account_number: formatAccountNumber(t.recipient_account_number),
  amount: t.amount ?? '',
  currency: t.currency ?? '',
  card_id: t.card_id ? String(t.card_id) : '',
  reference: t.reference ?? '',
  frequency: t.recurring_transactions?.[0]?.frequency ?? 'monthly',
  start_date: toDatetimeLocalValue(t.recurring_transactions?.[0]?.next_run_at),
  end_date: t.recurring_transactions?.[0]?.end_date ?? ''
})

export const useTemplateForm = ({ onClose, onSuccess, template }) => {
  const queryClient = useQueryClient()
  const isEditMode = !!template
  const recurringTransaction = template?.recurring_transactions?.[0]

  const initialFormData = useMemo(
    () => (isEditMode ? templateToForm(template) : EMPTY_FORM_TEMPLATES),
    [isEditMode, template]
  )

  const [formData, setFormData] = useState(initialFormData)
  const [step, setStep] = useState('form')
  const [pendingPayload, setPendingPayload] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const isRecurring = formData.type === 'recurring'
  const isStartDateLocked =
    isEditMode && isRecurring && recurringTransaction?.has_executed_transactions

  const { data: cardsData = [] } = useQuery({
    queryKey: queryKeys.cards.all,
    queryFn: getMyCards
  })

  const { data: currenciesData = [] } = useQuery({
    queryKey: queryKeys.currencies.all,
    queryFn: getSupportedCurrencies
  })

  const cards = cardsData.map((c) => ({ value: String(c.id), label: c.card_number_masked }))
  const currencies = currenciesData

  const templateMutation = useMutation({
    mutationFn: (payload) =>
      isEditMode ? updateTemplate(template.id, payload) : createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all })
      onSuccess?.()
    },
    onError: () => {
      setErrorMessage(`Failed to ${isEditMode ? 'update' : 'create'} template. Please try again.`)
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'recipient_account_number' ? formatAccountNumber(value) : value
    }))
  }

  const buildPayload = () => {
    const recipientAccountNumber = getAccountNumberDigits(formData.recipient_account_number)
    if (recipientAccountNumber.length !== ACCOUNT_NUMBER_LENGTH) {
      setErrorMessage('Recipient account number must contain exactly 16 digits.')
      return null
    }

    const payload = {
      name: formData.name,
      recipient: formData.recipient,
      recipient_account_number: recipientAccountNumber,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      card_id: parseInt(formData.card_id),
      reference: formData.reference || null,
      frequency: isRecurring ? formData.frequency : null,
      start_date: isRecurring ? toUTCISOString(formData.start_date) : null,
      end_date: isRecurring && formData.end_date ? formData.end_date : null
    }

    if (!isEditMode) payload.type = formData.type
    if (isStartDateLocked) delete payload.start_date

    if (isEditMode && isRecurring) {
      const originalStartDate = toDatetimeLocalValue(
        template.recurring_transactions?.[0]?.next_run_at
      )
      if (formData.start_date === originalStartDate) delete payload.start_date
    }

    return payload
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    const payload = buildPayload()
    if (!payload) return

    if (isRecurring && !isEditMode) {
      setPendingPayload(payload)
      setStep('pin')
    } else {
      templateMutation.mutate(payload)
    }
  }

  const handlePinConfirm = async (pin) => {
    await verifyCardPin(parseInt(formData.card_id), pin)
    templateMutation.mutate(pendingPayload)
  }

  return {
    formData,
    cards,
    currencies,
    loading: templateMutation.isPending,
    isEditMode,
    isRecurring,
    isStartDateLocked,
    step,
    setStep,
    errorMessage,
    setErrorMessage,
    handleChange,
    handleSubmit,
    handlePinConfirm,
    onCancel: onClose,
    FREQUENCIES
  }
}
