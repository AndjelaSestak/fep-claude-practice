import Button from '../../../components/ui/Button'

export const TransactionDetailsModal = ({ isOpen, onClose, loading, transaction }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading data...</p>
        ) : transaction ? (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Status:</span>
              <span
                className={`font-bold ${transaction.status === 'completed' ? 'text-green-600' : 'text-orange-500'}`}
              >
                {transaction.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="font-bold">
                {transaction.currency} {transaction.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Recipient:</span>
              <span className="font-semibold">{transaction.recipient || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Acc. Number:</span>
              <span className="text-sm font-mono">
                {transaction.recipient_account_number || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Reference:</span>
              <span className="italic">{transaction.reference || 'None'}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Date:</span>
              <span>{new Date(transaction.created_at).toLocaleString('sr-RS')}</span>
            </div>
            <Button className="w-full" size="lg" onClick={onClose} disabled={loading}>
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
