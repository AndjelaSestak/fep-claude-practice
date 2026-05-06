import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Sidebar from '../components/layout/SideBar'
import NavBarAfterLogin from '../components/layout/NavBarAfterLogin'
import PaymentCard from '../components/ui/PaymentCard'
import { ItemList } from '../components/ui/ItemList'
import Button from '../components/ui/Button'
import { getMyCards, deleteCard } from '../services/cardService'
import {
  blockCard,
  unblockCard,
  reportLostCard,
  reportStolenCard,
  getCardReports
} from '../services/card_reportService'
import Dialog, {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '../components/ui/Dialog'

import AlertDialog, {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '../components/ui/AlertDialog'

const CARD_TYPE_MAP = {
  1: 'Visa',
  2: 'Mastercard'
}

const REPORT_TYPE_STYLES = {
  manual_block: {
    card: 'border-red-600 bg-red-50',
    text: 'text-red-700'
  },
  admin_block: {
    card: 'border-slate-900 bg-slate-50',
    text: 'text-slate-900'
  },
  stolen: {
    card: 'border-orange-600 bg-orange-50',
    text: 'text-orange-700'
  },
  lost: {
    card: 'border-yellow-400 bg-yellow-50',
    text: 'text-yellow-700'
  }
}

const DEFAULT_REPORT_TYPE_STYLE = {
  card: 'border-gray-200 bg-white',
  text: 'text-gray-900'
}

const MyCardsPage = () => {
  const navigate = useNavigate()

  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  // DELETE DIALOG
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)

  // ERROR DIALOG
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // CARD REPORTS DIALOG
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false)
  const [reportsLoading, setReportsLoading] = useState(false)
  const [selectedCardReports, setSelectedCardReports] = useState([])

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await getMyCards()

      // safe fallback
      setCards(response ?? [])
    } catch (err) {
      setCards([])

      setErrorMessage(err.response?.data?.detail || 'Failed to load cards.')
      setErrorDialogOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (card) => {
    setCardToDelete(card)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteCard(cardToDelete.id)

      setCards((prev) => prev.filter((c) => c.id !== cardToDelete.id))
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to remove card.')
      setErrorDialogOpen(true)
    } finally {
      setDeleteDialogOpen(false)
      setCardToDelete(null)
    }
  }

  const handleBlock = async (cardId) => {
    try {
      await blockCard(cardId)
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, status: 'blocked' } : c)))
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to block card.')
      setErrorDialogOpen(true)
    }
  }

  const handleUnblock = async (cardId) => {
    try {
      await unblockCard(cardId)
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, status: 'active' } : c)))
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to unblock card.')
      setErrorDialogOpen(true)
    }
  }

  const handleReportLost = async (cardId) => {
    try {
      await reportLostCard(cardId)
      setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, status: 'reported_lost' } : c)))
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to report lost card.')
      setErrorDialogOpen(true)
    }
  }

  const handleReportStolen = async (cardId) => {
    try {
      await reportStolenCard(cardId)
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, status: 'reported_stolen' } : c))
      )
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to report stolen card.')
      setErrorDialogOpen(true)
    }
  }

  const handleViewReports = async (cardId) => {
    setReportsDialogOpen(true)
    setReportsLoading(true)
    setSelectedCardReports([])

    try {
      const reports = await getCardReports(cardId)
      setSelectedCardReports(reports ?? [])
    } catch (err) {
      setReportsDialogOpen(false)
      setErrorMessage(err.response?.data?.detail || 'Failed to load card reports.')
      setErrorDialogOpen(true)
    } finally {
      setReportsLoading(false)
    }
  }

  const formatReportType = (reportType) => {
    if (!reportType) return 'Unknown'

    return reportType
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getReportTypeStyle = (reportType) => {
    return REPORT_TYPE_STYLES[reportType] || DEFAULT_REPORT_TYPE_STYLE
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="flex-1 overflow-y-auto p-8">
          {/* HERO HEADER */}
          <header className="relative bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden mb-8">
            <div className="absolute -left-4 -top-4 w-32 h-32 bg-primary/15 rounded-full blur-3xl" />
            <div className="absolute right-10 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">
                  My Cards
                </span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">
                Payment Cards
              </h1>
              <p className="text-gray-700 font-semibold opacity-80">
                Manage your payment cards and settings.
              </p>
            </div>

            <div className="relative z-10">
              <Button
                onClick={() => navigate('/add-card')}
                className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6 rounded-2xl font-bold"
              >
                + New Card
              </Button>
            </div>
          </header>

          {/* CARDS GRID */}
          {loading ? (
            <p className="text-slate-500">Loading cards...</p>
          ) : (cards?.length ?? 0) === 0 ? (
            <p className="text-slate-500">You have no cards yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {cards.map((card) => (
                <PaymentCard
                  key={card.id}
                  cardNumber={card.card_number_masked?.slice(-4)}
                  accountNumber={card.account_number}
                  cardType={CARD_TYPE_MAP[card.card_type_id] || 'Unknown'}
                  status={card.status}
                  onBlock={() => handleBlock(card.id)}
                  onUnblock={() => handleUnblock(card.id)}
                  onReportStolen={() => handleReportStolen(card.id)}
                  onReportLost={() => handleReportLost(card.id)}
                  onRemove={() => handleRemove(card)}
                  onViewReports={() => handleViewReports(card.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* DELETE DIALOG */}
      <AlertDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove card</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove card ending in{' '}
            {cardToDelete?.card_number_masked?.slice(-4)}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* ERROR DIALOG */}
      <AlertDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setErrorDialogOpen(false)}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>

      {/* CARD REPORTS DIALOG */}
      <Dialog open={reportsDialogOpen} onClose={() => setReportsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Card reports</DialogTitle>
            <DialogDescription>
              {reportsLoading
                ? 'Loading reports...'
                : `${selectedCardReports.length} report(s) found.`}
            </DialogDescription>
          </DialogHeader>

          <ItemList
            className="mt-5 p-4 shadow-none"
            emptyMessage={reportsLoading ? 'Loading reports...' : 'No reports found for this card.'}
          >
            {!reportsLoading &&
              selectedCardReports.map((report, index) => (
                <div
                  key={`${report.report_type}-${report.created_at}-${index}`}
                  className={`rounded-lg border p-4 ${getReportTypeStyle(report.report_type).card}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-sm font-semibold ${getReportTypeStyle(report.report_type).text}`}
                    >
                      {formatReportType(report.report_type)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {report.created_at
                        ? new Date(report.created_at).toLocaleString()
                        : 'Unknown date'}
                    </span>
                  </div>
                </div>
              ))}
          </ItemList>

          <DialogFooter>
            <DialogClose onClose={() => setReportsDialogOpen(false)}>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MyCardsPage
