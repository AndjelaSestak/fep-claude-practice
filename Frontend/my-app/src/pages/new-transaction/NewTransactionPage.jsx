import { useNavigate } from 'react-router-dom'
import FormWrapper from '../../components/ui/FormWrapper'
import NewTransactionForm from './components/NewTransactionForm'
import PinStep from '../../components/ui/PinStep'
import { useNewTransaction } from '../../hooks/useNewTransaction'

const NewTransactionPage = () => {
  const navigate = useNavigate()
  const {
    formData,
    cards,
    currencies,
    loading,
    pinDialogOpen,
    errors,
    setPinDialogOpen,
    handleChange,
    handleSubmit,
    handlePinConfirm,
    handleClose
  } = useNewTransaction({
    open: true,
    onClose: () => navigate('/transactions'),
    onSuccess: () => navigate('/transactions')
  })

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center px-4 pt-12 pb-12">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">SecureBank</h1>
        </div>
        <p className="mt-2 text-lg text-slate-600">Secure, modern banking platform</p>
      </div>

      <FormWrapper>
        {pinDialogOpen ? (
          <PinStep
            onConfirm={handlePinConfirm}
            onBack={() => setPinDialogOpen(false)}
            loading={loading}
          />
        ) : (
          <NewTransactionForm
            formData={formData}
            cards={cards}
            currencies={currencies}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            onCancel={handleClose}
            errors={errors}
          />
        )}
      </FormWrapper>
    </div>
  )
}

export default NewTransactionPage
