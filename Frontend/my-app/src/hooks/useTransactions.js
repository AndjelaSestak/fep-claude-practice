import { useState, useEffect, useCallback } from 'react'
import { getTransactionById, getTransactionsForUser } from '../services/transactionService'
import { exportTransactions } from '../services/generateReportService'
import { triggerDownload } from '../utils/reportHelper'
import { toast } from 'react-toastify'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const limit = 10

  const [filters, setFilters] = useState({ search: '', type: 'all', direction: 'all' })

  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const [newTransactionOpen, setNewTransactionOpen] = useState(false)

  // 1. Fetching transactions from backend
  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const offset = (page - 1) * limit
      const data = await getTransactionsForUser(
        filters.search,
        limit,
        offset,
        filters.type,
        filters.direction
      )
      setTransactions(data)
    } catch (error) {
      console.error('Greška pri fetchu:', error)
      toast.error('Unable to fetch transactions. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page, filters.search, filters.type, filters.direction])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // 2. Local filtering of transactions based on type and direction
  useEffect(() => {
    let result = [...transactions]

    if (filters.type !== 'all') {
      result = result.filter((t) => t.type?.toLowerCase() === filters.type.toLowerCase())
    }

    if (filters.direction !== 'all') {
      result = result.filter((t) => t.direction?.toLowerCase() === filters.direction.toLowerCase())
    }

    setFilteredTransactions(result)
  }, [transactions, filters])

  // 3. Export
  const handleExport = async (format) => {
    try {
      const blobData = await exportTransactions(
        format,
        filters.search,
        filters.type,
        filters.direction
      )
      triggerDownload(blobData, `report.${format}`)
      toast.success('Report downloaded successfully!')
    } catch (error) {
      console.error('Mistake happened while downloading report:', error)
      toast.error('Failed to download report. Please try again.')
    }
  }

  // 4. Otvaranje detalja transakcije
  const handleTransactionClick = async (id) => {
    setDetailsLoading(true)
    setIsModalOpen(true)
    try {
      const data = await getTransactionById(id)
      setSelectedTransaction(data)
    } catch (error) {
      console.error('Greška kod detalja:', error)
      toast.error('Unable to load transaction details. Please try again.')
      setIsModalOpen(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  const nextPage = () => setPage((p) => p + 1)
  const prevPage = () => setPage((p) => Math.max(1, p - 1))
  const resetPage = () => setPage(1)

  return {
    transactions,
    filteredTransactions,
    loading,
    page,
    limit,
    filters,
    setFilters,
    selectedTransaction,
    isModalOpen,
    setIsModalOpen,
    detailsLoading,
    newTransactionOpen,
    setNewTransactionOpen,
    fetchTransactions,
    handleExport,
    handleTransactionClick,
    nextPage,
    prevPage,
    resetPage
  }
}
