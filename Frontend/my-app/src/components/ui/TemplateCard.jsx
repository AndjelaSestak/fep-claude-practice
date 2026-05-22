import { FileText, Play, Pencil, Trash2, RefreshCw, XCircle } from 'lucide-react'
import Button from './Button'

const TemplateCard = ({ template, onExecute, onEdit, onDelete, onDeactivate, onActivate }) => {
  const { name, recipient, amount, currency = 'RSD', card, type, recurring_transactions } = template

  const isRecurring = type === 'recurring'
  const isActive = recurring_transactions?.[0]?.is_active ?? false
  const frequency = recurring_transactions?.[0]?.frequency
  const cardType = card?.card_type?.name
  const cardNumber = card?.card_number_masked

  const ToggleIcon = isActive ? XCircle : RefreshCw
  const toggleLabel = isActive ? 'Deactivate' : 'Activate'
  const toggleAction = isActive ? onDeactivate : onActivate
  const toggleClassName = isActive
    ? 'w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700'
    : 'w-full border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 relative overflow-hidden">
      {isRecurring && !isActive && (
        <div className="absolute inset-0 bg-gray-50/50 pointer-events-none"></div>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-green-600" />
        </div>

        <div className="flex flex-col items-end gap-2">
          {isRecurring && (
            <div className="flex items-center gap-2">
              {/* STATUS BEDŽ */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                  isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>

              <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                <RefreshCw className="w-3 h-3" />
                {frequency ? frequency.charAt(0).toUpperCase() + frequency.slice(1) : 'Recurring'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="font-semibold text-gray-900 text-base">{name}</h3>
        <p className="text-gray-500 text-sm">{recipient}</p>
      </div>

      <div className="relative z-10">
        <p className="text-3xl font-bold text-gray-900">
          {currency} {amount}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {cardType} {cardNumber}
        </p>
      </div>

      <div className="mt-auto space-y-3 relative z-10">
        {!isRecurring && (
          <Button onClick={onExecute} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Execute
          </Button>
        )}

        {isRecurring && (
          <Button variant="outline" onClick={toggleAction} className={toggleClassName}>
            <ToggleIcon className="w-4 h-4 mr-2" />
            {toggleLabel}
          </Button>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onEdit} className="flex-1">
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={onDelete} className="flex-1">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TemplateCard
