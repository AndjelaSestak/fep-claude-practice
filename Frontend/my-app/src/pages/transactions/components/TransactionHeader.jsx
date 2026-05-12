import PageHeader from '../../../components/ui/PageHeader'
import Button from '../../../components/ui/Button'

const TransactionHeader = ({ handleExport, setNewTransactionOpen }) => {
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
            onClick={() => handleExport('csv')}
            className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
          >
            📊 CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExport('pdf')}
            className="hover:bg-white rounded-xl text-primary-dark font-bold transition-all px-4"
          >
            📄 PDF
          </Button>
        </div>

        <Button
          onClick={() => setNewTransactionOpen(true)}
          className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform px-6 rounded-2xl font-bold"
        >
          + New Transaction
        </Button>
      </div>
    </PageHeader>
  )
}

export default TransactionHeader
