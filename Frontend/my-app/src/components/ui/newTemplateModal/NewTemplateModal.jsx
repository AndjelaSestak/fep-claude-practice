import { useTemplateForm } from '../../../hooks/useTemplateForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '../Dialog'
import TemplateFormFields from './TemplateFormFields'
import Button from '../Button'
import AlertDialog from '../AlertDialog'

const NewTemplateModal = ({ open, onClose, onSuccess, template = null }) => {
  const {
    formData,
    cards,
    currencies,
    loading,
    isEditMode,
    isRecurring,
    isStartDateLocked,
    successDialogOpen,
    errorDialogOpen,
    errorMessage,
    handleChange,
    handleSubmit,
    handleSuccessConfirm,
    handleErrorClose,
    FREQUENCIES
  } = useTemplateForm({ open, onClose, onSuccess, template })

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Template' : 'Create Template'}</DialogTitle>
            <DialogDescription>Save transaction details for quick reuse.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

            <DialogFooter>
              <DialogClose onClose={onClose}>Cancel</DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={successDialogOpen}
        onClose={handleSuccessConfirm}
        title={isEditMode ? 'Template updated' : 'Template created'}
        description={`Your template has been ${isEditMode ? 'updated' : 'saved'} and is ready to use.`}
        confirmLabel="Done"
        onConfirm={handleSuccessConfirm}
      />

      <AlertDialog
        open={errorDialogOpen}
        onClose={handleErrorClose}
        title={`Failed to ${isEditMode ? 'update' : 'create'} template`}
        description={errorMessage}
        confirmLabel="Close"
        onConfirm={handleErrorClose}
      />
    </>
  )
}

export default NewTemplateModal
