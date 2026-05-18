import AlertDialog from '../../../components/ui/AlertDialog'
import PinModal from '../../../components/ui/PinModal'
import NewTemplateModal from '../../../components/ui/NewTemplateModal'
import { useTemplatesContext } from '../../../context/TemplatesContext'

const TemplatesModals = () => {
  const {
    newTemplateOpen,
    setNewTemplateOpen,
    editTarget,
    setEditTarget,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    deactivateTarget,
    setDeactivateTarget,
    confirmDeactivate,
    executeSuccessOpen,
    onExecuteSuccessClose,
    executeErrorOpen,
    onExecuteErrorClose,
    pinDialogOpen,
    onPinClose,
    onPinConfirm,
    pinLoading
  } = useTemplatesContext()

  return (
    <>
      <NewTemplateModal
        open={newTemplateOpen || !!editTarget}
        template={editTarget}
        onClose={editTarget ? () => setEditTarget(null) : () => setNewTemplateOpen(false)}
        onSuccess={editTarget ? () => setEditTarget(null) : () => setNewTemplateOpen(false)}
      />

      <AlertDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete template?"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={confirmDelete}
      />

      <AlertDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate Subscription?"
        description={`Are you sure you want to stop future payments for "${deactivateTarget?.name}"? This will not delete the template, but payments will no longer trigger automatically.`}
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        onConfirm={confirmDeactivate}
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
}

export default TemplatesModals
