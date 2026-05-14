import { useEffect, useState, useCallback } from 'react'
import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import Button from '../../components/ui/Button'
import { TransactionItem } from '../../components/ui/TransactionItem'
import { ItemList } from '../../components/ui/ItemList'
import { TransactionFilters } from '../../components/ui/TransactionFilters'
import { getTransactionById, getTransactionsForUser } from '../../services/transactionService'
import { exportTransactions } from '../../services/generateReportService'
import { triggerDownload } from '../../utils/reportHelper'
import DashboardHeader from './components/DashboardHeader'

const DashboardPage = () => {
  // Promenjen state: inicijalno prazan niz umesto mock-a
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ search: '', type: 'all', direction: 'all' })

  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // --- LOGIKA ZA EXPORT (Download) ---
  const handleMonthlyExport = async (format) => {
    try {
      // Za dashboard nam treba samo format i period
      const blobData = await exportTransactions(format, null, null, null, 'current_month')

      triggerDownload(blobData, `mesecni_izvestaj.${format}`)
    } catch (error) {
      console.error('Desila se greška pri preuzimanju mesečnog izveštaja:', error)
    }
  }

  // --- LOGIKA ZA DOHVATANJE SVIH TRANSAKCIJA (API) ---
  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTransactionsForUser(
        filters.search,
        10,
        0,
        filters.type,
        filters.direction
      )

      let result = data

      if (filters.type !== 'all') {
        result = result.filter((t) => t.type === filters.type)
      }

      if (filters.direction !== 'all') {
        result = result.filter((t) => t.direction === filters.direction)
      }

      setTransactions(result)
    } catch (error) {
      console.error('Greška pri učitavanju transakcija:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // --- LOGIKA ZA DETALJE ---
  const handleTransactionClick = async (id) => {
    setDetailsLoading(true)
    setIsModalOpen(true)
    try {
      const data = await getTransactionById(id)
      setSelectedTransaction(data)
    } catch (error) {
      console.error('Neuspešno učitavanje detalja:', error)
      setIsModalOpen(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-10">
            <DashboardHeader />

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <TransactionFilters onFilterChange={setFilters} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-end w-full">
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-[0.12em]">
                  Download monthly export
                </p>
              </div>

              <div className="flex justify-end w-full">
                <div className="flex bg-primary/20 p-1 rounded-2xl backdrop-blur-sm border border-white/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMonthlyExport('csv')}
                    className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
                  >
                    📊 CSV
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMonthlyExport('pdf')}
                    className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
                  >
                    📄 PDF
                  </Button>
                </div>
              </div>
              <ItemList
                title="Transactions"
                description={loading ? 'Loading...' : `Showing ${transactions.length} results`}
                emptyMessage="No transactions found."
              >
                <div className="grid gap-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      onClick={() => handleTransactionClick(transaction.id)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <TransactionItem transaction={transaction} />
                    </div>
                  ))}
                </div>
              </ItemList>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL ZA DETALJE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {detailsLoading ? (
              <p className="text-center py-10">Loading data...</p>
            ) : selectedTransaction ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`font-bold ${selectedTransaction.status === 'completed' ? 'text-green-600' : 'text-orange-500'}`}
                  >
                    {selectedTransaction.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-bold">
                    {selectedTransaction.currency} {selectedTransaction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Recipient:</span>
                  <span className="font-semibold">{selectedTransaction.recipient || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Acc. Number:</span>
                  <span className="text-sm font-mono">
                    {selectedTransaction.recipient_account_number || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Reference:</span>
                  <span className="italic">{selectedTransaction.reference || 'None'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Date:</span>
                  <span>{new Date(selectedTransaction.created_at).toLocaleString('sr-RS')}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Close
                </Button>
              </div>
            ) : (
              <p className="text-red-500 text-center">Error while loading.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
