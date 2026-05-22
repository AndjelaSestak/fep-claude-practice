import FormField from '../../../components/ui/FormField'
import Input from '../../../components/ui/InputField'
import Select from '../../../components/ui/Select'
import Button from '../../../components/ui/Button'

const NewTransactionForm = ({
  formData,
  cards,
  currencies,
  loading,
  handleChange,
  handleSubmit,
  onCancel,
  errors
}) => (
  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
    <div className="mb-8">
      <h2 className="text-4xl font-bold text-slate-900">New Transaction</h2>
      <p className="mt-2 text-lg text-slate-600">Fill in the details to send a new payment.</p>
    </div>

    <FormField label="Card" required>
      <Select
        name="card_id"
        value={formData.card_id}
        onChange={handleChange}
        placeholder="Select a card"
        options={cards}
        required
        error={errors.card_id}
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
            error={errors.amount}
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
            error={errors.currency}
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
        error={errors.recipient}
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
        error={errors.recipient_account_number}
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

    <div className="pt-2 flex flex-col gap-2">
      <Button type="submit" className="w-full" disabled={loading}>
        Send Payment
      </Button>
      <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </form>
)

export default NewTransactionForm
