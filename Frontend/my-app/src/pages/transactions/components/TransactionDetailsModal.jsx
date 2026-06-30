import Button from '../../../components/ui/Button'
import { useTransactionContext } from '../../../context/TransactionContext'
import { formatDateTime } from '../../../utils/formatters'

export const TransactionDetailsModal = () => {
  const { isModalOpen, setIsModalOpen, detailsLoading, selectedTransaction } =
    useTransactionContext()

  if (!isModalOpen) return null

  return (
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
              <span>{formatDateTime(selectedTransaction.created_at)}</span>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => setIsModalOpen(false)}
              disabled={detailsLoading}
            >
              Close
            </Button>
          </div>
        ) : (
          <p className="text-red-500 text-center">Error while loading.</p>
        )}
      </div>
    </div>
  )
}
