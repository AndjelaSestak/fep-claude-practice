import AlertDialog from '../../../components/ui/AlertDialog'
import CardReportsDialog from './CardReportsDialog'
import { useCardsContext } from '../../../context/CardsContext'

const CardsModals = () => {
  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    cardToDelete,
    confirmDelete,
    actionDialogOpen,
    setActionDialogOpen,
    pendingAction,
    confirmAction,
    reportsDialogOpen,
    setReportsDialogOpen,
    reportsLoading,
    selectedCardReports
  } = useCardsContext()

  return (
    <>
      <AlertDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Remove card"
        description={`Are you sure you want to remove card ending in ${cardToDelete?.card_number_masked?.slice(-4)}? This action cannot be undone.`}
        confirmLabel="Remove"
        onConfirm={confirmDelete}
        cancelLabel="Cancel"
      />

      <AlertDialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        title={pendingAction?.config?.title}
        description={pendingAction?.config?.description}
        confirmLabel={pendingAction?.config?.confirmLabel}
        onConfirm={confirmAction}
        cancelLabel="Cancel"
      />

      <CardReportsDialog
        open={reportsDialogOpen}
        onClose={() => setReportsDialogOpen(false)}
        reportsLoading={reportsLoading}
        selectedCardReports={selectedCardReports}
      />
    </>
  )
}

export default CardsModals
