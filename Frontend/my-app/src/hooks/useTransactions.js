import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queryKeys } from '../lib/queryKeys'
import { getTransactionById, getTransactionsForUser } from '../services/transactionService'
import { exportTransactions as exportTransactionsRequest } from '../services/generateReportService'
import { triggerDownload } from '../utils/reportHelper'

export const useTransactions = () => {
  const [page, setPage] = useState(1)
  const limit = 10

  const [filters, setFilters] = useState({ search: '', type: 'all', direction: 'all' })

  const [selectedTransactionId, setSelectedTransactionId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [newTransactionOpen, setNewTransactionOpen] = useState(false)

  const transactionsQuery = useQuery({
    queryKey: queryKeys.transactions.list({ ...filters, page, limit }),
    queryFn: () => {
      const offset = (page - 1) * limit

      return getTransactionsForUser(filters.search, limit, offset, filters.type, filters.direction)
    }
  })

  const transactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data])
  const refetchTransactions = transactionsQuery.refetch

  useEffect(() => {
    if (transactionsQuery.isError) {
      console.error('Mistake happened while fetching transactions:', transactionsQuery.error)
      toast.error('Unable to fetch transactions. Please try again.')
    }
  }, [transactionsQuery.isError, transactionsQuery.error])

  const transactionDetailsQuery = useQuery({
    queryKey: queryKeys.transactions.detail(selectedTransactionId),
    queryFn: () => getTransactionById(selectedTransactionId),
    enabled: isModalOpen && selectedTransactionId != null
  })

  useEffect(() => {
    if (transactionDetailsQuery.isError) {
      console.error(
        'Mistake happened while loading transaction details:',
        transactionDetailsQuery.error
      )
      toast.error('Unable to load transaction details. Please try again.')
    }
  }, [transactionDetailsQuery.isError, transactionDetailsQuery.error])

  const filteredTransactions = useMemo(() => {
    return transactions
  }, [transactions])

  const exportTransactionsMutation = useMutation({
    mutationFn: (format) =>
      exportTransactionsRequest(format, filters.search, filters.type, filters.direction),
    onSuccess: (blobData, format) => {
      triggerDownload(blobData, `report.${format}`)
      toast.success('Report downloaded successfully!')
    },
    onError: (error) => {
      console.error('Mistake happened while downloading report:', error)
      toast.error('Failed to download report. Please try again.')
    }
  })

  const handleTransactionClick = (id) => {
    setSelectedTransactionId(id)
    setIsModalOpen(true)
  }

  const nextPage = () => setPage((p) => p + 1)
  const prevPage = () => setPage((p) => Math.max(1, p - 1))
  const resetPage = () => setPage(1)

  return {
    transactions,
    filteredTransactions,
    loading: transactionsQuery.isLoading,
    page,
    limit,
    filters,
    setFilters,
    selectedTransaction: transactionDetailsQuery.data,
    isModalOpen,
    setIsModalOpen,
    detailsLoading: transactionDetailsQuery.isLoading,
    newTransactionOpen,
    setNewTransactionOpen,
    refetchTransactions,
    exportTransactions: exportTransactionsMutation.mutate,
    isExportTransactionsPending: exportTransactionsMutation.isPending,
    handleTransactionClick,
    nextPage,
    prevPage,
    resetPage
  }
}
