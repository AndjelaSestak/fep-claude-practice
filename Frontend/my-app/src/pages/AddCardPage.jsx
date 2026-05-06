import { useState, useEffect } from 'react'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import Input from '../components/ui/InputField'
import { useNavigate } from 'react-router-dom'
import FormWrapper from '../components/ui/FormWrapper'
import { createCard } from '../services/cardService'
import { useAuth } from '../context/AuthContext'

import AlertDialog, {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '../components/ui/AlertDialog'

const AddCardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    cardholder_name: '',
    card_type_id: ''
  })

  const [loading, setLoading] = useState(false)
  const [cardTypeOpen, setCardTypeOpen] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [createdCardId, setCreatedCardId] = useState(null)

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({ ...prev, cardholder_name: user.name.toUpperCase() }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await createCard({
        cardholder_name: user?.name?.toUpperCase() || '',
        card_type_id: parseInt(formData.card_type_id) || 0
      })

      setCreatedCardId(response.id)
      setSuccessDialogOpen(true)
    } catch (err) {
      const data = err.response?.data
      let message = 'Something went wrong. Please try again.'

      const FIELD_LABELS = {
        cardholder_name: 'Cardholder Name',
        card_type_id: 'Card Type'
      }

      if (Array.isArray(data?.detail)) {
        const emptyFields = data.detail
          .filter(
            (e) =>
              e.type === 'string_too_short' ||
              e.type === 'missing' ||
              e.type === 'int_parsing_error'
          )
          .map((e) => FIELD_LABELS[e.loc?.[1]] || e.loc?.[1])
          .filter(Boolean)

        if (emptyFields.length > 0) {
          message = `Please fill in the following fields: ${emptyFields.join(', ')}.`
        } else {
          const seen = new Set()
          message = data.detail
            .map((e) => e.msg?.replace(/^Value error,\s*/i, '') || 'Invalid value')
            .filter((msg) => !seen.has(msg) && seen.add(msg))
            .join('\n')
        }
      } else if (typeof data?.detail === 'string') {
        message = data.detail
      }

      setErrorMessage(message)
      setErrorDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pt-12 pb-12">
      {/* SUCCESS DIALOG — simple confirmation, details come after OTP */}
      <AlertDialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Card Created!</AlertDialogTitle>
          <AlertDialogDescription>
            Your card has been created. Please verify your email with the OTP code we just sent you
            to complete the process.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setSuccessDialogOpen(false)
              navigate('/verify_email', {
                state: { email: user?.email, type: 'card', cardId: createdCardId }
              })
            }}
          >
            Verify Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* ERROR DIALOG */}
      <AlertDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Card creation failed</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="whitespace-pre-line">{errorMessage}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setErrorDialogOpen(false)}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>

      {/* HEADER */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">SecureBank</h1>
        </div>
        <p className="mt-2 text-lg text-slate-600">Secure, modern banking platform</p>
      </div>

      {/* FORM */}
      <FormWrapper>
        <div className="w-full">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-900">Add a new card</h2>
            <p className="mt-2 text-lg text-slate-600">
              Card details are generated automatically and sent to your email.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cardholder Name — read-only, filled from account */}
            <FormField label="Cardholder Name">
              <Input
                name="cardholder_name"
                value={formData.cardholder_name}
                disabled
                className="bg-slate-50 cursor-not-allowed opacity-70"
              />
            </FormField>

            {/* Card Type */}
            <FormField label="Card Type" required>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCardTypeOpen((prev) => !prev)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-left flex justify-between items-center hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <span className={formData.card_type_id ? 'text-slate-900' : 'text-slate-400'}>
                    {formData.card_type_id === '1'
                      ? 'Visa'
                      : formData.card_type_id === '2'
                        ? 'MasterCard'
                        : 'Select card type'}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${cardTypeOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {cardTypeOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
                    {[
                      { label: 'Visa', value: '1' },
                      { label: 'MasterCard', value: '2' }
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, card_type_id: opt.value }))
                          setCardTypeOpen(false)
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors ${
                          formData.card_type_id === opt.value
                            ? 'bg-slate-50 font-medium text-primary'
                            : 'text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            <div className="pt-2 flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating card...' : 'Create card'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/my_cards')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </FormWrapper>
    </div>
  )
}

export default AddCardPage
