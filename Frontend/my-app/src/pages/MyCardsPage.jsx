import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Sidebar from '../components/layout/SideBar'
import NavBarAfterLogin from '../components/layout/NavBarAfterLogin'
import PaymentCard from '../components/ui/PaymentCard'
import { getMyCards, deleteCard } from '../services/cardService'

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

      setErrorMessage(
        err.response?.data?.detail || 'Failed to load cards.'
      )
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

      setCards(prev =>
        prev.filter(c => c.id !== cardToDelete.id)
      )
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail || 'Failed to remove card.'
      )
      setErrorDialogOpen(true)
    } finally {
      setDeleteDialogOpen(false)
      setCardToDelete(null)
    }
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="flex-1 overflow-y-auto p-8">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Payment Cards
              </h1>
              <p className="text-slate-500 mt-1">
                Manage your payment cards
              </p>
            </div>

            <button
              onClick={() => navigate('/add-card')}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} />
              Add Card
            </button>
          </div>

          {/* CARDS GRID */}
          {loading ? (
            <p className="text-slate-500">Loading cards...</p>
          ) : (cards?.length ?? 0) === 0 ? (
            <p className="text-slate-500">You have no cards yet.</p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {cards.map(card => (
                <PaymentCard
                  key={card.id}
                  cardNumber={card.card_number_masked?.slice(-4)}
                  cardType={
                    CARD_TYPE_MAP[card.card_type_id] || 'Unknown'
                  }
                  status={card.status}
                  onBlock={() => {}}
                  onUnblock={() => {}}
                  onReportStolen={() => {}}
                  onReportLost={() => {}}
                  onRemove={() => handleRemove(card)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* DELETE DIALOG */}
      <AlertDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove card
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove card ending in{' '}
            {cardToDelete?.card_number_masked?.slice(-4)}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>

      {/* ERROR DIALOG */}
      <AlertDialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Error</AlertDialogTitle>
          <AlertDialogDescription>
            {errorMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setErrorDialogOpen(false)}>
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  )
}

export default MyCardsPage