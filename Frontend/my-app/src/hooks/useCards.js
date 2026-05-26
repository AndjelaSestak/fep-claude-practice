import { useState, useEffect, useRef } from 'react'
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
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import { ACTION_CONFIG_CARDS } from '../utils/constants'

export const useCards = () => {
  const queryClient = useQueryClient()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)

  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const [reportsDialogOpen, setReportsDialogOpen] = useState(false)
  const [activeReportCardId, setActiveReportCardId] = useState(null)

  const [coolingDownCardId, setCoolingDownCardId] = useState(null)
  const cooldownTimer = useRef(null)

  const startCooldown = (cardId) => {
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current)
    setCoolingDownCardId(cardId)
    cooldownTimer.current = setTimeout(() => setCoolingDownCardId(null), 2000)
  }

  const invalidateCards = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.cards.all, exact: true })

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
    if (isCardsError) toast.error(getApiErrorMessage(cardsError, 'Failed to load cards.'))
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
    if (isReportsError)
      toast.error(getApiErrorMessage(reportsError, 'Failed to load card reports.'))
  }, [isReportsError, reportsError])

  const deleteMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      invalidateCards()
      toast.success('Card removed successfully.')
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to remove card.'))
  })

  const blockMutation = useMutation({
    mutationFn: blockCard,
    onMutate: optimisticUpdate('blocked'),
    onSuccess: (_, cardId) => {
      startCooldown(cardId)
      toast.success('Card blocked.')
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.reports(cardId) })
    },
    onError: (err, vars, context) => {
      rollback(err, vars, context)
      toast.error(getApiErrorMessage(err, 'Failed to block card.'))
    }
  })

  const unblockMutation = useMutation({
    mutationFn: unblockCard,
    onMutate: optimisticUpdate('active'),
    onSuccess: (_, cardId) => {
      startCooldown(cardId)
      toast.success('Card unblocked.')
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.reports(cardId) })
    },
    onError: (err, vars, context) => {
      rollback(err, vars, context)
      toast.error(getApiErrorMessage(err, 'Failed to unblock card.'))
    }
  })

  const reportLostMutation = useMutation({
    mutationFn: reportLostCard,
    onMutate: optimisticUpdate('reported_lost'),
    onSuccess: (_, cardId) => {
      startCooldown(cardId)
      toast.success('Card reported as lost.')
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.reports(cardId) })
    },
    onError: (err, vars, context) => {
      rollback(err, vars, context)
      toast.error(getApiErrorMessage(err, 'Failed to report lost card.'))
    }
  })

  const reportStolenMutation = useMutation({
    mutationFn: reportStolenCard,
    onMutate: optimisticUpdate('reported_stolen'),
    onSuccess: (_, cardId) => {
      startCooldown(cardId)
      toast.success('Card reported as stolen.')
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.reports(cardId) })
    },
    onError: (err, vars, context) => {
      rollback(err, vars, context)
      toast.error(getApiErrorMessage(err, 'Failed to report stolen card.'))
    }
  })

  const handleRemove = (cardId, lastFourDigits) => {
    setCardToDelete({ id: cardId, lastFourDigits })
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

  const openActionDialog = (mutate, cardId, config) => {
    setPendingAction({ mutate, cardId, config })
    setActionDialogOpen(true)
  }

  const confirmAction = () => {
    pendingAction.mutate(pendingAction.cardId, {
      onSettled: () => {
        setActionDialogOpen(false)
        setPendingAction(null)
      }
    })
  }

  const handleBlock = (cardId) =>
    openActionDialog(blockMutation.mutate, cardId, ACTION_CONFIG_CARDS.block)
  const handleUnblock = (cardId) =>
    openActionDialog(unblockMutation.mutate, cardId, ACTION_CONFIG_CARDS.unblock)
  const handleReportLost = (cardId) =>
    openActionDialog(reportLostMutation.mutate, cardId, ACTION_CONFIG_CARDS.reportLost)
  const handleReportStolen = (cardId) =>
    openActionDialog(reportStolenMutation.mutate, cardId, ACTION_CONFIG_CARDS.reportStolen)

  const handleViewReports = (cardId) => {
    setActiveReportCardId(cardId)
    setReportsDialogOpen(true)
  }

  return {
    cards,
    loading,
    coolingDownCardId,
    deleteDialogOpen,
    cardToDelete,
    handleRemove,
    confirmDelete,
    setDeleteDialogOpen,
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
    setReportsDialogOpen
  }
}
