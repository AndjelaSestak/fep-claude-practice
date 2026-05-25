import Button from '../../../components/ui/Button'
import TemplateFormFields from './TemplateFormFields'
import { useNewTemplateContext } from '../../../context/NewTemplateContext'

const NewTemplateForm = () => {
  const {
    formData,
    cards,
    currencies,
    loading,
    isEditMode,
    isRecurring,
    isStartDateLocked,
    handleChange,
    handleSubmit,
    onCancel,
    FREQUENCIES
  } = useNewTemplateContext()

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-900">
          {isEditMode ? 'Edit Template' : 'New Template'}
        </h2>
        <p className="mt-2 text-lg text-slate-600">Save transaction details for quick reuse.</p>
      </div>

      <TemplateFormFields
        formData={formData}
        onChange={handleChange}
        cards={cards}
        currencies={currencies}
        isEditMode={isEditMode}
        isRecurring={isRecurring}
        isStartDateLocked={isStartDateLocked}
        frequencies={FREQUENCIES}
      />

      <div className="pt-2 flex flex-col gap-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Saving...' : isEditMode ? 'Save Changes' : isRecurring ? 'Continue' : 'Create Template'}
        </Button>
        <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default NewTemplateForm
