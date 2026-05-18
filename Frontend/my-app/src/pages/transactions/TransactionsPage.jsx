import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import NewTransactionModal from '../../components/ui/newTransactionModal/NewTransactionModal'
import { TransactionDetailsModal } from '../transactions/components/TransactionDetailsModal'
import { Pagination } from '../../components/ui/Pagination'
import { TransactionListSection } from '../transactions/components/TransactionListSection'
import { useTransactions } from '../../hooks/useTransactions'
import TransactionHeader from '../transactions/components/TransactionHeader'

const TransactionsPage = () => {
  const {
    transactions,
    filteredTransactions,
    loading,
    page,
    limit,
    setFilters,
    selectedTransaction,
    isModalOpen,
    setIsModalOpen,
    detailsLoading,
    newTransactionOpen,
    setNewTransactionOpen,
    refetchTransactions,
    exportTransactions,
    handleTransactionClick,
    nextPage,
    prevPage,
    resetPage
  } = useTransactions()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />

        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <TransactionHeader
              handleExport={exportTransactions}
              setNewTransactionOpen={setNewTransactionOpen}
            />
            <TransactionListSection
              loading={loading}
              page={page}
              filteredTransactions={filteredTransactions}
              onFilterChange={(newFilters) => {
                setFilters(newFilters)
                resetPage()
              }}
              onTransactionClick={handleTransactionClick}
              onTransactionCancel={refetchTransactions}
            />

            <Pagination
              page={page}
              onPrev={prevPage}
              onNext={nextPage}
              disablePrev={page === 1 || loading}
              disableNext={transactions.length < limit || loading}
            />
          </div>
        </main>
      </div>

      <NewTransactionModal
        open={newTransactionOpen}
        onClose={() => setNewTransactionOpen(false)}
        onSuccess={refetchTransactions}
      />

      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loading={detailsLoading}
        transaction={selectedTransaction}
      />
    </div>
  )
}

export default TransactionsPage
