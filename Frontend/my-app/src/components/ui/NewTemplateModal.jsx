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
import AlertDialog from './AlertDialog'
import { getMyCards } from '../../services/cardService'
import { getSupportedCurrencies } from '../../services/transactionService'
import { createTemplate, updateTemplate } from '../../services/templateService'
import { createTemplateSchema } from '../../schemas/template'

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

const EMPTY_FORM = {
  name: '',
  type: 'single',
  recipient: '',
  recipient_account_number: '',
  amount: '',
  currency: '',
  card_id: '',
  reference: '',
  frequency: 'monthly',
  start_date: '',
  end_date: ''
}

const getAccountNumberDigits = (value) =>
  String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, 16)

const formatAccountNumber = (value) =>
  getAccountNumberDigits(value)
    .replace(/(.{4})/g, '$1 ')
    .trim()

const padDatePart = (value) => String(value).padStart(2, '0')

const toDatetimeLocalValue = (value) => {
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

const NewTemplateModal = ({ open, onClose, onSuccess, template = null }) => {
  const isEditMode = !!template
  const recurringTransaction = template?.recurring_transactions?.[0]

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [cards, setCards] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setFormData(isEditMode ? templateToForm(template) : EMPTY_FORM)
    setErrors({})
    setErrorMessage('')
    setErrorDialogOpen(false)
  }, [open, isEditMode, template])

  useEffect(() => {
    if (!open) return

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
        setErrorMessage('Failed to load form data. Please try again.')
        setErrorDialogOpen(true)
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
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const isRecurring = formData.type === 'recurring'
  const isStartDateLocked =
    isEditMode && isRecurring && recurringTransaction?.has_executed_transactions

  const handleClose = () => {
    setErrors({})
    setErrorMessage('')
    setErrorDialogOpen(false)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = createTemplateSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors = {}

      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})

    const validData = result.data
    const recipientAccountNumber = getAccountNumberDigits(validData.recipient_account_number)

    setLoading(true)
    try {
      const payload = {
        name: validData.name,
        recipient: validData.recipient,
        recipient_account_number: recipientAccountNumber,
        amount: parseFloat(validData.amount),
        currency: validData.currency,
        card_id: parseInt(validData.card_id),
        reference: validData.reference || null,
        frequency: isRecurring ? validData.frequency : null,
        start_date: isRecurring ? toUTCISOString(validData.start_date) : null,
        end_date: isRecurring && validData.end_date ? validData.end_date : null
      }

      if (!isEditMode) {
        payload.type = formData.type
      }

      if (isStartDateLocked) {
        delete payload.start_date
      }

      if (isEditMode && isRecurring) {
        const originalStartDate = toDatetimeLocalValue(
          template.recurring_transactions?.[0]?.next_run_at
        )
        if (validData.start_date === originalStartDate) {
          delete payload.start_date
        }
      }

      if (isEditMode) {
        await updateTemplate(template.id, payload)
      } else {
        await createTemplate(payload)
      }

      setSuccessDialogOpen(true)
    } catch {
      setErrorMessage(`Failed to ${isEditMode ? 'update' : 'create'} template. Please try again.`)
      setErrorDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent className="max-w-lg  overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Template' : 'Create Template'}</DialogTitle>
            <DialogDescription>Save transaction details for quick reuse.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
            <FormField label="Template Name" required>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Monthly Rent"
                required
                error={errors.name}
              />
            </FormField>

            {!isEditMode && (
              <FormField label="Transaction Type" required>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="single"
                      checked={formData.type === 'single'}
                      onChange={handleChange}
                      className="accent-green-600 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Single</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="recurring"
                      checked={formData.type === 'recurring'}
                      onChange={handleChange}
                      className="accent-green-600 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Recurring</span>
                  </label>
                </div>
              </FormField>
            )}

            <FormField label="Recipient" required>
              <Input
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                placeholder="Recipient name"
                required
                error={errors.recipient}
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
                error={errors.recipient_account_number}
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
                    error={errors.amount}
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
                    error={errors.currency}
                  />
                </FormField>
              </div>
            </div>

            <FormField label="Payment Card" required>
              <Select
                name="card_id"
                value={formData.card_id}
                onChange={handleChange}
                placeholder="Select a card"
                options={cards}
                required
                error={errors.card_id}
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

            {isRecurring && (
              <>
                <FormField label="Frequency" required>
                  <Select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    options={FREQUENCIES}
                    required
                    error={errors.frequency}
                  />
                </FormField>

                <FormField label="Start Date" required>
                  <Input
                    name="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={handleChange}
                    disabled={isStartDateLocked}
                    required
                    error={errors.start_date}
                  />
                </FormField>

                <FormField label="End Date (Optional)">
                  <Input
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                </FormField>
              </>
            )}

            <DialogFooter>
              <DialogClose type="button" onClose={handleClose}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title={isEditMode ? 'Template updated' : 'Template created'}
        description={`Your template has been ${isEditMode ? 'updated' : 'saved'} and is ready to use.`}
        confirmLabel="Done"
        onConfirm={() => {
          setSuccessDialogOpen(false)
          handleClose()
          onSuccess?.()
        }}
      />

      <AlertDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title={`Failed to ${isEditMode ? 'update' : 'create'} template`}
        description={errorMessage}
        confirmLabel="Close"
        onConfirm={() => setErrorDialogOpen(false)}
      />
    </>
  )
}

export default NewTemplateModal
