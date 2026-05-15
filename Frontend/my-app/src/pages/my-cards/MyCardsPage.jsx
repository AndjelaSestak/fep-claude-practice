import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import AlertDialog from '../../components/ui/AlertDialog'
import CardsList from './components/CardsList'
import CardReportsDialog from './components/CardReportsDialog'
import { useCards } from '../../hooks/useCards'

const ACTION_CONFIG = {
  block: {
    title: 'Block card',
    description:
      'Are you sure you want to block this card? You will not be able to use it until you unblock it.',
    confirmLabel: 'Block'
  },
  unblock: {
    title: 'Unblock card',
    description: 'Are you sure you want to unblock this card?',
    confirmLabel: 'Unblock'
  },
  reportLost: {
    title: 'Report as lost',
    description: 'Are you sure you want to report this card as lost?',
    confirmLabel: 'Report Lost'
  },
  reportStolen: {
    title: 'Report as stolen',
    description: 'Are you sure you want to report this card as stolen?',
    confirmLabel: 'Report Stolen'
  }
}

const MyCardsPage = () => {
  const navigate = useNavigate()
  const {
    cards,
    loading,
    deleteDialogOpen,
    cardToDelete,
    confirmDelete,
    handleRemove,
    actionDialogOpen,
    pendingAction,
    confirmAction,
    setActionDialogOpen,
    handleBlock,
    handleUnblock,
    handleReportLost,
    handleReportStolen,
    reportsDialogOpen,
    reportsLoading,
    selectedCardReports,
    handleViewReports,
    setDeleteDialogOpen,
    setReportsDialogOpen
  } = useCards()

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="flex-1 overflow-y-auto p-8">
          <PageHeader
            label="My Cards"
            title="Payment Cards"
            subtitle="Manage your payment cards and settings."
          >
            <Button
              onClick={() => navigate('/add_card')}
              className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6 rounded-2xl font-bold"
            >
              + New Card
            </Button>
          </PageHeader>

          <CardsList
            cards={cards}
            loading={loading}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
            onReportStolen={handleReportStolen}
            onReportLost={handleReportLost}
            onRemove={handleRemove}
            onViewReports={handleViewReports}
          />
        </main>
      </div>

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
        title={ACTION_CONFIG[pendingAction?.type]?.title}
        description={ACTION_CONFIG[pendingAction?.type]?.description}
        confirmLabel={ACTION_CONFIG[pendingAction?.type]?.confirmLabel}
        onConfirm={confirmAction}
        cancelLabel="Cancel"
      />

      <CardReportsDialog
        open={reportsDialogOpen}
        onClose={() => setReportsDialogOpen(false)}
        reportsLoading={reportsLoading}
        selectedCardReports={selectedCardReports}
      />
    </div>
  )
}

export default MyCardsPage
