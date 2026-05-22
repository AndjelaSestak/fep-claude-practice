import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import NewTransactionModal from '../../components/ui/newTransactionModal/NewTransactionModal'
import { TransactionDetailsModal } from '../transactions/components/TransactionDetailsModal'
import { Pagination } from '../../components/ui/Pagination'
import { TransactionListSection } from '../transactions/components/TransactionListSection'
import TransactionHeader from '../transactions/components/TransactionHeader'
import { TransactionProvider, useTransactionContext } from '../../context/TransactionContext'

const TransactionsContent = () => {
  const {
    transactions,
    limit,
    page,
    newTransactionOpen,
    setNewTransactionOpen,
    refetchTransactions,
    nextPage,
    prevPage,
    loading
  } = useTransactionContext()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />
        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <TransactionHeader />
            <TransactionListSection />
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
      <TransactionDetailsModal />
    </div>
  )
}

const TransactionsPage = () => (
  <TransactionProvider>
    <TransactionsContent />
  </TransactionProvider>
)

export default TransactionsPage
