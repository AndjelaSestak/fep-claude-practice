import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { cancelTransaction } from '../services/transactionService'

export const useTransactionItem = ({ transaction, onCancel }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const cancelMutation = useMutation({
    mutationFn: () => cancelTransaction(transaction.id),
    onSuccess: () => {
      setConfirmOpen(false)
      onCancel?.()
    },
    onError: () => setConfirmOpen(false)
  })

  return {
    confirmOpen,
    setConfirmOpen,
    loading: cancelMutation.isPending,
    handleCancel: () => cancelMutation.mutate()
  }
}
