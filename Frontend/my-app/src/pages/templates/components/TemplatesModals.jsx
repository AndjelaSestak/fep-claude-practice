import AlertDialog from '../../../components/ui/AlertDialog'
import PinModal from '../../../components/ui/PinModal'
import NewTemplateModal from '../../../components/ui/NewTemplateModal'

const TemplatesModals = ({
  newTemplateOpen,
  onNewTemplateClose,
  editTarget,
  onEditClose,
  deleteTarget,
  onDeleteCancel,
  onDeleteConfirm,
  deactivateTarget,
  onDeactivateCancel,
  onDeactivateConfirm,
  executeSuccessOpen,
  onExecuteSuccessClose,
  executeErrorOpen,
  onExecuteErrorClose,
  pinDialogOpen,
  onPinClose,
  onPinConfirm,
  pinLoading
}) => (
  <>
    <NewTemplateModal
      open={newTemplateOpen}
      onClose={onNewTemplateClose}
      onSuccess={onNewTemplateClose}
    />

    <NewTemplateModal
      open={!!editTarget}
      template={editTarget}
      onClose={onEditClose}
      onSuccess={onEditClose}
    />

    <AlertDialog
      open={!!deleteTarget}
      onClose={onDeleteCancel}
      title="Delete template?"
      description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      confirmLabel="Delete"
      cancelLabel="Keep it"
      onConfirm={onDeleteConfirm}
    />

    <AlertDialog
      open={!!deactivateTarget}
      onClose={onDeactivateCancel}
      title="Deactivate Subscription?"
      description={`Are you sure you want to stop future payments for "${deactivateTarget?.name}"? This will not delete the template, but payments will no longer trigger automatically.`}
      confirmLabel="Deactivate"
      cancelLabel="Cancel"
      onConfirm={onDeactivateConfirm}
    />

    <AlertDialog
      open={executeSuccessOpen}
      onClose={onExecuteSuccessClose}
      title="Transaction submitted"
      description="Your transaction has been submitted and is being processed."
      confirmLabel="Done"
      onConfirm={onExecuteSuccessClose}
    />

    <AlertDialog
      open={executeErrorOpen}
      onClose={onExecuteErrorClose}
      title="Execution failed"
      description="Failed to execute template."
      confirmLabel="Close"
      onConfirm={onExecuteErrorClose}
    />

    <PinModal
      open={pinDialogOpen}
      onClose={onPinClose}
      onConfirm={onPinConfirm}
      loading={pinLoading}
    />
  </>
)

export default TemplatesModals
