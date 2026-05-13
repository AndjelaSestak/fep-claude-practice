import Button from '../../../components/ui/Button'
import FormField from '../../../components/ui/FormField'
import Input from '../../../components/ui/InputField'
import FilterBar from '../../../components/ui/FilterBar'
import FormWrapper from '../../../components/ui/FormWrapper'
import AlertDialog from '../../../components/ui/AlertDialog'
import { useCreateCard } from '../../../hooks/useCreateCard'

const CARD_TYPE_OPTIONS = [
  { label: 'Visa', value: '1' },
  { label: 'MasterCard', value: '2' }
]

const AddCardForm = () => {
  const {
    cardholderName,
    cardTypeId,
    setCardTypeId,
    addCardSuccessDialogOpen,
    handleCloseAddCardDialog,
    handleCancelAddCard,
    handleAddCardSubmit,
    handleVerifyNow,
    isAddCardPending
  } = useCreateCard()

  return (
    <>
      <AlertDialog
        open={addCardSuccessDialogOpen}
        onClose={handleCloseAddCardDialog}
        title="Card Created!"
        description="Your card has been created. Please verify your email with the OTP code we just sent you to complete the process."
        confirmLabel="Verify Now"
        cancelLabel="Later"
        onConfirm={handleVerifyNow}
      />

      <FormWrapper>
        <div className="w-full">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-slate-900">Add a new card</h2>
            <p className="mt-2 text-lg text-slate-600">
              Card details are generated automatically and sent to your email.
            </p>
          </div>

          <form onSubmit={handleAddCardSubmit} className="space-y-5">
            <FormField label="Cardholder Name">
              <Input
                name="cardholder_name"
                value={cardholderName}
                disabled
                className="bg-slate-50 cursor-not-allowed opacity-70"
              />
            </FormField>

            <FormField label="Card Type" required>
              <FilterBar
                label="Select card type"
                options={CARD_TYPE_OPTIONS}
                value={cardTypeId}
                onChange={setCardTypeId}
              />
            </FormField>

            <div className="pt-2 flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isAddCardPending || !cardTypeId}>
                {isAddCardPending ? 'Creating card...' : 'Create card'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCancelAddCard}
                disabled={isAddCardPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </FormWrapper>
    </>
  )
}

export default AddCardForm
