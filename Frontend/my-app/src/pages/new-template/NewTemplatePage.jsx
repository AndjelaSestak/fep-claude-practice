import FormWrapper from '../../components/ui/FormWrapper'
import AlertDialog from '../../components/ui/AlertDialog'
import NewTemplateForm from './components/NewTemplateForm'
import PinStep from '../../components/ui/PinStep'
import { NewTemplateProvider, useNewTemplateContext } from '../../context/NewTemplateContext'

const NewTemplateContent = () => {
  const {
    step,
    setStep,
    loading,
    isEditMode,
    errorMessage,
    setErrorMessage,
    handlePinConfirm
  } = useNewTemplateContext()

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
        {step === 'pin' ? (
          <PinStep
            onConfirm={handlePinConfirm}
            onBack={() => setStep('form')}
            loading={loading}
          />
        ) : (
          <NewTemplateForm />
        )}
      </FormWrapper>

      <AlertDialog
        open={!!errorMessage}
        onClose={() => setErrorMessage('')}
        title={`Failed to ${isEditMode ? 'update' : 'create'} template`}
        description={errorMessage}
        confirmLabel="Close"
        onConfirm={() => setErrorMessage('')}
      />
    </div>
  )
}

const NewTemplatePage = () => (
  <NewTemplateProvider>
    <NewTemplateContent />
  </NewTemplateProvider>
)

export default NewTemplatePage
