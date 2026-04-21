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

const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, '')
    .match(/.{1,4}/g)
    ?.join('-')
    .slice(0, 19) || ''
}

const AddCardPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    card_number: '',
    cardholder_name: '',
    expiry_month: '',
    expiry_year: '',
    card_type_id: '',
    cvv: '',
    card_pin: ''
  })

  const [loading, setLoading] = useState(false)
  const [cardTypeOpen, setCardTypeOpen] = useState(false)

  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const { user } = useAuth()
  const [createdCardId, setCreatedCardId] = useState(null)

  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({
        ...prev,
        cardholder_name: user.name.toUpperCase()
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await createCard({
      card_number: formData.card_number,
      cardholder_name: user?.name?.toUpperCase() || '',
      expiry_month: parseInt(formData.expiry_month) || 0,
      expiry_year: parseInt(formData.expiry_year) || 0,
      card_type_id: parseInt(formData.card_type_id) || 0,
      cvv: formData.cvv,
      card_pin: formData.card_pin
    })

      setSuccessDialogOpen(true)
      setCreatedCardId(response.id)

    } catch (err) {
      const data = err.response?.data
      let message = 'Something went wrong. Please try again.'

      const FIELD_LABELS = {
        card_number: 'Card Number',
        cardholder_name: 'Cardholder Name',
        expiry_month: 'Expiry Month',
        expiry_year: 'Expiry Year',
        card_type_id: 'Card Type',
        cvv: 'CVV',
        card_pin: 'Card PIN',
      }

      if (Array.isArray(data?.detail)) {
        const emptyFields = data.detail
          .filter(e =>
            e.type === 'string_too_short' ||
            e.type === 'missing' ||
            e.type === 'int_parsing_error'
          )
          .map(e => FIELD_LABELS[e.loc?.[1]] || e.loc?.[1])
          .filter(Boolean)

        if (emptyFields.length > 0) {
          message = `Please fill in the following fields: ${emptyFields.join(', ')}.`
        } else {
          const seen = new Set()
          message = data.detail
            .map(e => e.msg?.replace(/^Value error,\s*/i, '') || 'Invalid value')
            .filter(msg => !seen.has(msg) && seen.add(msg))
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

      {/* SUCCESS DIALOG */}
      <AlertDialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Card created</AlertDialogTitle>
          <AlertDialogDescription>
            Your card has been successfully created.
            You will now be redirected to verification.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setSuccessDialogOpen(false)
              navigate('/verify-email', {
                state: { email: user?.email, type: 'card', cardId: createdCardId }
              })
            }}
          >
            Continue
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
          <AlertDialogCancel onClick={() => setErrorDialogOpen(false)}>
            Close
          </AlertDialogCancel>
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
            <p className="mt-2 text-lg text-slate-600">Enter your card details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Card Number */}
            <FormField label="Card Number" required>
              <Input
                name="card_number"
                value={formatCardNumber(formData.card_number)}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    card_number: e.target.value.replace(/\D/g, '').slice(0, 16)
                  }))
                }
                placeholder="1234-5678-9012-3456"
                maxLength={19}
              />
            </FormField>

            {/* Cardholder Name */}
            <FormField label="Cardholder Name" required>
              <Input
                name="cardholder_name"
                value={formData.cardholder_name}
                onChange={handleChange}
                placeholder="JOHN DOE"
                disabled
                className="bg-slate-50 cursor-not-allowed opacity-70"
              />
            </FormField>

            {/* Expiry */}
            <div className="flex gap-4">
              <div className="flex-1">
                <FormField label="Expiry Month" required>
                  <Input
                    name="expiry_month"
                    value={formData.expiry_month}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        expiry_month: e.target.value.replace(/\D/g, '').slice(0, 2)
                      }))
                    }
                    placeholder="MM"
                  />
                </FormField>
              </div>
              <div className="flex-1">
                <FormField label="Expiry Year" required>
                  <Input
                    name="expiry_year"
                    value={formData.expiry_year}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        expiry_year: e.target.value.replace(/\D/g, '').slice(0, 4)
                      }))
                    }
                    placeholder="YYYY"
                  />
                </FormField>
              </div>
            </div>

            {/* CVV */}
            <FormField label="CVV" required>
              <Input
                name="cvv"
                value={formData.cvv}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                  }))
                }
                type="password"
                placeholder="123"
              />
            </FormField>

            {/* Card Type */}
            <FormField label="Card Type" required>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCardTypeOpen(prev => !prev)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-left flex justify-between items-center hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                >
                  <span className={formData.card_type_id ? 'text-slate-900' : 'text-slate-400'}>
                    {formData.card_type_id === '1' ? 'Visa' : formData.card_type_id === '2' ? 'MasterCard' : 'Select card type'}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${cardTypeOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {cardTypeOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden">
                    {[{ label: 'Visa', value: '1' }, { label: 'MasterCard', value: '2' }].map(opt => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, card_type_id: opt.value }))
                          setCardTypeOpen(false)
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors ${
                          formData.card_type_id === opt.value ? 'bg-slate-50 font-medium text-primary' : 'text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            {/* Card PIN */}
            <FormField label="Card PIN" required>
              <Input
                name="card_pin"
                value={formData.card_pin}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    card_pin: e.target.value.replace(/\D/g, '').slice(0, 4)
                  }))
                }
                type="password"
                placeholder="4-digit PIN"
              />
            </FormField>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating card...' : 'Create card'}
              </Button>
            </div>

          </form>
        </div>
      </FormWrapper>
    </div>
  )
}

export default AddCardPage