import FormField from '../FormField'
import Input from '../InputField'
import Select from '../Select'

const TemplateFormFields = ({
  formData,
  onChange,
  cards,
  currencies,
  isEditMode,
  isRecurring,
  isStartDateLocked,
  frequencies
}) => {
  return (
    <>
      <FormField label="Template Name" required>
        <Input
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="e.g., Monthly Rent"
          required
        />
      </FormField>

      {!isEditMode && (
        <FormField label="Transaction Type" required>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="single"
                checked={formData.type === 'single'}
                onChange={onChange}
                className="accent-green-600 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Single</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="recurring"
                checked={formData.type === 'recurring'}
                onChange={onChange}
                className="accent-green-600 w-4 h-4"
              />
              <span className="text-sm text-gray-700">Recurring</span>
            </label>
          </div>
        </FormField>
      )}

      <FormField label="Recipient" required>
        <Input
          name="recipient"
          value={formData.recipient}
          onChange={onChange}
          placeholder="Recipient name"
          required
        />
      </FormField>

      <FormField label="Recipient Account Number" required>
        <Input
          name="recipient_account_number"
          value={formData.recipient_account_number}
          onChange={onChange}
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          maxLength={19}
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
              onChange={onChange}
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
              onChange={onChange}
              placeholder="Select currency"
              options={currencies}
              required
            />
          </FormField>
        </div>
      </div>

      <FormField label="Payment Card" required>
        <Select
          name="card_id"
          value={formData.card_id}
          onChange={onChange}
          placeholder="Select a card"
          options={cards}
          required
        />
      </FormField>

      <FormField label="Reference">
        <Input
          name="reference"
          value={formData.reference}
          onChange={onChange}
          placeholder="Optional description"
        />
      </FormField>

      {isRecurring && (
        <>
          <FormField label="Frequency" required>
            <Select
              name="frequency"
              value={formData.frequency}
              onChange={onChange}
              options={frequencies}
              required
            />
          </FormField>

          <FormField label="Start Date" required>
            <Input
              name="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={onChange}
              disabled={isStartDateLocked}
              required
            />
          </FormField>

          <FormField label="End Date (Optional)">
            <Input name="end_date" type="date" value={formData.end_date} onChange={onChange} />
          </FormField>
        </>
      )}
    </>
  )
}

export default TemplateFormFields
