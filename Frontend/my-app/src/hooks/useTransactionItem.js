import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { queryKeys } from '../lib/queryKeys'
import { cancelTransaction } from '../services/transactionService'

export const useTransactionItem = ({ transaction, onCancel }) => {
  const queryClient = useQueryClient()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isIncoming = transaction.direction === 'incoming'

  const cancelMutation = useMutation({
    mutationFn: () => cancelTransaction(transaction.id),
    onSuccess: () => {
      setConfirmOpen(false)
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.detail(transaction.id) })
      onCancel?.()
    },
    onError: () => setConfirmOpen(false)
  })

  return {
    confirmOpen,
    setConfirmOpen,
    loading: cancelMutation.isPending,
    handleCancel: () => cancelMutation.mutate(),
    isIncoming
  }
}
