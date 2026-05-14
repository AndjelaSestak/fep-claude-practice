import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queryKeys } from '../lib/queryKeys'
import { getMyCards, deleteCard } from '../services/cardService'
import {
  blockCard,
  unblockCard,
  reportLostCard,
  reportStolenCard,
  getCardReports
} from '../services/cardReportService'

// TODO: move getApiError to a shared utility and replace local invalidateQueries calls with a shared helper per hook
const getApiError = (err, fallback) => err?.response?.data?.detail || fallback

export const useCards = () => {
  const queryClient = useQueryClient()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)

  const [reportsDialogOpen, setReportsDialogOpen] = useState(false)
  const [activeReportCardId, setActiveReportCardId] = useState(null)

  const invalidateCards = () => queryClient.invalidateQueries({ queryKey: queryKeys.cards.all, exact: true })

  const optimisticUpdate = (status) => async (cardId) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.cards.all, exact: true })
    const previousCards = queryClient.getQueryData(queryKeys.cards.all)
    queryClient.setQueryData(queryKeys.cards.all, (old) =>
      old?.map((card) => (card.id === cardId ? { ...card, status } : card))
    )
    return { previousCards }
  }

  const rollback = (_err, _vars, context) => {
    queryClient.setQueryData(queryKeys.cards.all, context?.previousCards)
  }

  const {
    data: cards = [],
    isLoading: loading,
    isError: isCardsError,
    error: cardsError
  } = useQuery({
    queryKey: queryKeys.cards.all,
    queryFn: getMyCards
  })

  useEffect(() => {
    if (isCardsError) toast.error(getApiError(cardsError, 'Failed to load cards.'))
  }, [isCardsError, cardsError])

  const {
    data: selectedCardReports = [],
    isLoading: reportsLoading,
    isError: isReportsError,
    error: reportsError
  } = useQuery({
    queryKey: queryKeys.cards.reports(activeReportCardId),
    queryFn: () => getCardReports(activeReportCardId),
    enabled: activeReportCardId !== null
  })

  useEffect(() => {
    if (isReportsError) toast.error(getApiError(reportsError, 'Failed to load card reports.'))
  }, [isReportsError, reportsError])

  const deleteMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      invalidateCards()
      toast.success('Card removed successfully.')
    },
    onError: (err) => toast.error(getApiError(err, 'Failed to remove card.'))
  })

  const blockMutation = useMutation({
    mutationFn: blockCard,
    onMutate: optimisticUpdate('blocked'),
    onSuccess: () => toast.success('Card blocked.'),
    onError: (err, vars, context) => {
      rollback(err, vars, context)
      toast.error(getApiError(err, 'Failed to block card.'))
    }
  })

  const unblockMutation = useMutation({
    mutationFn: unblockCard,
    onMutate: optimisticUpdate('active'),
    onSuccess: () => toast.success('Card unblocked.'),
    onError: (err, vars, context) => {
      rollback(err, vars, context)
      toast.error(getApiError(err, 'Failed to unblock card.'))
    }
  })

  const reportLostMutation = useMutation({
    mutationFn: reportLostCard,
    onMutate: optimisticUpdate('reported_lost'),
    onSuccess: () => toast.success('Card reported as lost.'),
    onError: (err, vars, context) => {
      rollback(err, vars, context)
      toast.error(getApiError(err, 'Failed to report lost card.'))
    }
  })

  const reportStolenMutation = useMutation({
    mutationFn: reportStolenCard,
    onMutate: optimisticUpdate('reported_stolen'),
    onSuccess: () => toast.success('Card reported as stolen.'),
    onError: (err, vars, context) => {
      rollback(err, vars, context)
      toast.error(getApiError(err, 'Failed to report stolen card.'))
    }
  })

  const handleRemove = (card) => {
    setCardToDelete(card)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    deleteMutation.mutate(cardToDelete.id, {
      onSettled: () => {
        setDeleteDialogOpen(false)
        setCardToDelete(null)
      }
    })
  }

  const handleBlock = (cardId) => blockMutation.mutate(cardId)
  const handleUnblock = (cardId) => unblockMutation.mutate(cardId)
  const handleReportLost = (cardId) => reportLostMutation.mutate(cardId)
  const handleReportStolen = (cardId) => reportStolenMutation.mutate(cardId)

  const handleViewReports = (cardId) => {
    setActiveReportCardId(cardId)
    setReportsDialogOpen(true)
  }

  return {
    cards,
    loading,
    deleteDialogOpen,
    cardToDelete,
    handleRemove,
    confirmDelete,
    setDeleteDialogOpen,
    handleBlock,
    handleUnblock,
    handleReportLost,
    handleReportStolen,
    reportsDialogOpen,
    reportsLoading,
    selectedCardReports,
    handleViewReports,
    setReportsDialogOpen
  }
}
