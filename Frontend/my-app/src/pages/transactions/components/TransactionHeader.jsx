import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'
import { FileSpreadsheet, FileText, Plus } from 'lucide-react'
import { useTransactionContext } from '../../../context/TransactionContext'

const TransactionHeader = () => {
  const { exportTransactions, setNewTransactionOpen } = useTransactionContext()
  return (
    <PageHeader
      label="Management"
      title="Transactions"
      subtitle="View and manage your financial history."
    >
      <div className="flex flex-wrap gap-3">
        <div className="flex bg-white/40 p-1 rounded-2xl backdrop-blur-sm border border-white/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportTransactions('csv')}
            className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
          >
            <FileSpreadsheet size={16} /> CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportTransactions('pdf')}
            className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
          >
            <FileText size={16} /> PDF
          </Button>
        </div>

        <Button
          onClick={() => setNewTransactionOpen(true)}
          className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6 rounded-2xl font-bold"
        >
          <Plus size={16} /> New Transaction
        </Button>
      </div>
    </PageHeader>
  )
}

export default TransactionHeader
