import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createCard } from '../services/cardService'
import { useAuth } from './useAuth'

// TODO: move getApiError to a shared utility
const getApiError = (err, fallback) => err?.response?.data?.detail || fallback

export const useCreateCard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const cardholderName = user?.name?.toUpperCase() || ''

  const [cardTypeId, setCardTypeId] = useState('')
  const [addCardSuccessDialogOpen, setAddCardSuccessDialogOpen] = useState(false)
  const [createdCardId, setCreatedCardId] = useState(null)

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: (response) => {
      setCreatedCardId(response.id)
      setCardTypeId('')
      setAddCardSuccessDialogOpen(true)
    },
    onError: (err) => toast.error(getApiError(err, 'Failed to create card.'))
  })

  const handleAddCardSubmit = (e) => {
    e.preventDefault()
    createCardMutation.mutate({
      cardholder_name: cardholderName,
      card_type_id: parseInt(cardTypeId)
    })
  }

  const handleVerifyNow = () => {
    setAddCardSuccessDialogOpen(false)
    navigate('/verify_email', {
      state: { email: user?.email, type: 'card', cardId: createdCardId }
    })
  }

  const handleCloseAddCardDialog = () => setAddCardSuccessDialogOpen(false)
  const handleCancelAddCard = () => navigate('/my_cards')

  return {
    cardholderName,
    cardTypeId,
    setCardTypeId,
    addCardSuccessDialogOpen,
    handleCloseAddCardDialog,
    handleCancelAddCard,
    handleAddCardSubmit,
    handleVerifyNow,
    isAddCardPending: createCardMutation.isPending
  }
}
