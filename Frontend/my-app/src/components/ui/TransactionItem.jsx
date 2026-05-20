import { cn } from '../../utils/cn'
import { ArrowUpRight, ArrowDownLeft, Clock, X } from 'lucide-react'
import Button from './Button'
import AlertDialog from './AlertDialog'
import { useTransactionItem } from '../../hooks/useTransactionitem'

export function TransactionItem({ transaction, className, onCancel, currentUserAccountNumber }) {
  const { confirmOpen, setConfirmOpen, loading, handleCancel, isIncoming } = useTransactionItem({
    transaction,
    onCancel,
    currentUserAccountNumber
  })

  const status = transaction.status
  const isPending = status === 'pending'
  const isCancelled = status === 'cancelled'
  const isFailed = status === 'failed'

  const displayName = isIncoming
    ? transaction.sender || 'Unknown sender'
    : transaction.recipient || 'Unknown recipient'

  const displayType = transaction.type === 'recurring' ? 'Recurring' : 'Single'

  const formattedDate = new Date(transaction.created_at).toLocaleDateString('sr-RS')

  const formattedAmount = `${isIncoming ? '+' : '-'}${transaction.currency} ${Number(
    transaction.amount
  ).toLocaleString('sr-RS', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`

  const renderIcon = () => {
    if (isPending) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
          <Clock className="h-4 w-4" />
        </div>
      )
    }
    if (isCancelled || isFailed) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <X className="h-4 w-4" />
        </div>
      )
    }
    return (
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isIncoming ? 'bg-green-100 text-primary-dark' : 'bg-red-100 text-red-500'
        )}
      >
        {isIncoming ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
      </div>
    )
  }

  const renderRight = () => {
    if (isCancelled) {
      return (
        <div className="text-right">
          <p className="text-base font-medium text-gray-400 line-through">{formattedAmount}</p>
          <p className="text-sm font-medium text-gray-400">Cancelled</p>
        </div>
      )
    }
    if (isFailed) {
      return (
        <div className="text-right">
          <p className="text-base font-medium text-gray-400 line-through">{formattedAmount}</p>
          <p className="text-sm font-medium text-red-400">Failed</p>
        </div>
      )
    }
    if (isPending) {
      return (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base font-medium text-gray-900">{formattedAmount}</p>
            <p className="text-sm text-yellow-500 font-medium">Pending</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setConfirmOpen(true)
            }}
          >
            Cancel
          </Button>
        </div>
      )
    }
    return (
      <div className="text-right">
        <p className={cn('text-base font-medium', isIncoming ? 'text-primary' : 'text-gray-900')}>
          {formattedAmount}
        </p>
        <p className="text-sm text-gray-500">{displayType}</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between rounded-xl border border-gray-200 bg-surface px-4 py-3',
          (isCancelled || isFailed) && 'opacity-60',
          className
        )}
      >
        <div className="flex items-center gap-4">
          {renderIcon()}
          <div>
            <p className="text-base font-medium text-gray-900">{displayName}</p>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>

        {renderRight()}
      </div>

      <AlertDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Cancel transaction?"
        description="Are you sure you want to cancel this transaction? This action cannot be undone."
        confirmLabel={loading ? 'Cancelling...' : 'Yes, cancel'}
        cancelLabel="Keep it"
        onConfirm={handleCancel}
      />
    </>
  )
}
