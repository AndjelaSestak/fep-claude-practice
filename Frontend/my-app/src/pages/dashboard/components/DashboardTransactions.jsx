import Button from '../../../components/ui/Button'
import { ItemList } from '../../../components/ui/ItemList'
import { TransactionFilters } from '../../../components/ui/TransactionFilters'
import { TransactionItem } from '../../../components/ui/TransactionItem'
import { useTransactions } from '../../../hooks/useTransactions'
import MonthlyExportActions from './MonthlyExportActions'
import { useBalance } from '../../../hooks/useBalance'

const DashboardTransactions = () => {
  const { accountNumber } = useBalance()
  const {
    filteredTransactions,
    loading,
    setFilters,
    selectedTransaction,
    isModalOpen,
    setIsModalOpen,
    detailsLoading,
    handleTransactionClick,
    exportTransactions
  } = useTransactions()

  return (
    <>
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <TransactionFilters onFilterChange={setFilters} />
      </div>

      <div className="space-y-2">
        <MonthlyExportActions onExport={exportTransactions} />

        <ItemList
          title="Transactions"
          description={loading ? 'Loading...' : `Showing ${filteredTransactions.length} results`}
          emptyMessage="No transactions found."
        >
          <div className="grid gap-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction.id)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <TransactionItem
                  transaction={transaction}
                  currentUserAccountNumber={accountNumber}
                />
              </div>
            ))}
          </div>
        </ItemList>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                X
              </button>
            </div>

            {detailsLoading ? (
              <p className="text-center py-10">Loading data...</p>
            ) : selectedTransaction ? (
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Status:</span>
                  <span
                    className={`font-bold ${
                      selectedTransaction.status === 'completed'
                        ? 'text-green-600'
                        : 'text-orange-500'
                    }`}
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
    </>
  )
}

export default DashboardTransactions
