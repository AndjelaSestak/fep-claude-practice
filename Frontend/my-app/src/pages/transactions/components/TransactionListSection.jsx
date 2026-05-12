import { TransactionFilters } from '../ui/TransactionFilters'
import { ItemList } from '../ui/ItemList'
import { TransactionItem } from '../ui/TransactionItem'

export const TransactionListSection = ({
  loading,
  page,
  filteredTransactions,
  onFilterChange,
  onTransactionClick,
  onTransactionCancel
}) => {
  return (
    <>
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <TransactionFilters onFilterChange={onFilterChange} />
      </div>

      <ItemList title="Transaction History" description={loading ? 'Loading...' : `Page ${page}`}>
        <div className="grid gap-3">
          {filteredTransactions.length > 0
            ? filteredTransactions.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onTransactionClick(t.id)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <TransactionItem transaction={t} onCancel={onTransactionCancel} />
                </div>
              ))
            : !loading && (
                <p className="text-center py-10 text-gray-500">
                  No results found for these filters.
                </p>
              )}
        </div>
      </ItemList>
    </>
  )
}
