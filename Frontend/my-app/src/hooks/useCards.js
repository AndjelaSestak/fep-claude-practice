import { useState } from 'react'
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

export const useCards = () => {
  const queryClient = useQueryClient()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)

  const [reportsDialogOpen, setReportsDialogOpen] = useState(false)
  const [reportsLoading, setReportsLoading] = useState(false)
  const [selectedCardReports, setSelectedCardReports] = useState([])

  const { data: cards = [], isLoading: loading } = useQuery({
    queryKey: queryKeys.cards.all,
    queryFn: getMyCards,
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to load cards.')
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all })
      toast.success('Card removed successfully.')
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to remove card.')
  })

  const blockMutation = useMutation({
    mutationFn: blockCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all })
      toast.success('Card blocked.')
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to block card.')
  })

  const unblockMutation = useMutation({
    mutationFn: unblockCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all })
      toast.success('Card unblocked.')
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to unblock card.')
  })

  const reportLostMutation = useMutation({
    mutationFn: reportLostCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all })
      toast.success('Card reported as lost.')
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to report lost card.')
  })

  const reportStolenMutation = useMutation({
    mutationFn: reportStolenCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all })
      toast.success('Card reported as stolen.')
    },
    onError: (err) => toast.error(err.response?.data?.detail || 'Failed to report stolen card.')
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

  const handleViewReports = async (cardId) => {
    setReportsDialogOpen(true)
    setReportsLoading(true)
    setSelectedCardReports([])

    try {
      const reports = await getCardReports(cardId)
      setSelectedCardReports(reports ?? [])
    } catch (err) {
      setReportsDialogOpen(false)
      toast.error(err.response?.data?.detail || 'Failed to load card reports.')
    } finally {
      setReportsLoading(false)
    }
  }

  return {
    cards,
    loading,
    deleteDialogOpen,
    cardToDelete,
    confirmDelete,
    handleRemove,
    handleBlock: (cardId) => blockMutation.mutate(cardId),
    handleUnblock: (cardId) => unblockMutation.mutate(cardId),
    handleReportLost: (cardId) => reportLostMutation.mutate(cardId),
    handleReportStolen: (cardId) => reportStolenMutation.mutate(cardId),
    reportsDialogOpen,
    reportsLoading,
    selectedCardReports,
    handleViewReports,
    setDeleteDialogOpen,
    setReportsDialogOpen
  }
}
