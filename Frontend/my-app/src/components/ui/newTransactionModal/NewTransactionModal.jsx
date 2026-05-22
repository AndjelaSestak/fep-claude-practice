import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../Dialog'
import PinModal from '../PinModal'
import { NewTransactionForm } from './components/NewTransactionForm'
import { useNewTransaction } from '../../../hooks/useNewTransaction'

const NewTransactionModal = ({ open, onClose, onSuccess }) => {
  const {
    formData,
    cards,
    currencies,
    loading,
    pinDialogOpen,
    errors,
    setPinDialogOpen,
    handleChange,
    handleSubmit,
    handlePinConfirm,
    handleClose
  } = useNewTransaction({ open, onClose, onSuccess })

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogDescription>Fill in the details to send a new payment.</DialogDescription>
          </DialogHeader>
          <NewTransactionForm
            formData={formData}
            cards={cards}
            currencies={currencies}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            onClose={handleClose}
            errors={errors}
          />
        </DialogContent>
      </Dialog>

      <PinModal
        open={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        onConfirm={handlePinConfirm}
        loading={loading}
      />
    </>
  )
}

export default NewTransactionModal
