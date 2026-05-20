import { TransactionFilters } from '../../../components/ui/TransactionFilters'
import { ItemList } from '../../../components/ui/ItemList'
import { TransactionItem } from '../../../components/ui/TransactionItem'
import { useTransactionContext } from '../../../context/TransactionContext'

export const TransactionListSection = () => {
  const {
    filteredTransactions,
    loading,
    page,
    setFilters,
    resetPage,
    refetchTransactions,
    handleTransactionClick
  } = useTransactionContext()
  return (
    <>
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <TransactionFilters onFilterChange={setFilters} />
      </div>

      <ItemList title="Transaction History" description={loading ? 'Loading...' : `Page ${page}`}>
        <div className="grid gap-3">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((t) => (
              <div
                key={t.id}
                onClick={() => handleTransactionClick(t.id)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <TransactionItem transaction={t} onCancel={refetchTransactions} />
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-500">No results found for these filters.</p>
          )}
        </div>
      </ItemList>
    </>
  )
}
