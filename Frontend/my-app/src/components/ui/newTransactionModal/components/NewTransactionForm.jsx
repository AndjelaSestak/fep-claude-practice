import FormField from '../../FormField'
import Input from '../../InputField'
import Select from '../../Select'
import Button from '../../Button'
import { DialogFooter, DialogClose } from '../../Dialog'

export const NewTransactionForm = ({
  formData,
  cards,
  currencies,
  loading,
  handleChange,
  handleSubmit,
  onClose
}) => {
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <FormField label="Card" required>
        <Select
          name="card_id"
          value={formData.card_id}
          onChange={handleChange}
          placeholder="Select a card"
          options={cards}
          required
        />
      </FormField>

      <div className="flex gap-4">
        <div className="flex-1">
          <FormField label="Amount" required>
            <Input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </FormField>
        </div>
        <div className="flex-1">
          <FormField label="Currency" required>
            <Select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              placeholder="Select currency"
              options={currencies}
              required
            />
          </FormField>
        </div>
      </div>

      <FormField label="Recipient" required>
        <Input
          name="recipient"
          value={formData.recipient}
          onChange={handleChange}
          placeholder="Full name of recipient"
          required
        />
      </FormField>

      <FormField label="Recipient Account Number" required>
        <Input
          name="recipient_account_number"
          value={formData.recipient_account_number}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          maxLength={19}
          required
        />
      </FormField>

      <FormField label="Reference">
        <Input
          name="reference"
          value={formData.reference}
          onChange={handleChange}
          placeholder="Optional description"
        />
      </FormField>

      <DialogFooter>
        <DialogClose onClose={onClose}>Cancel</DialogClose>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Payment'}
        </Button>
      </DialogFooter>
    </form>
  )
}
