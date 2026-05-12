import { createPortal } from 'react-dom'
import Button from './Button'

const AlertDialog = ({
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  cancelLabel = 'Cancel',
  confirmDisabled
}) => {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="default" onClick={onConfirm} disabled={confirmDisabled}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// TODO: Legacy exports — ostali fajlovi koji još koriste stari API neće pući
// dok ih kolege ne refaktorišu
export const AlertDialogHeader = ({ children }) => <div>{children}</div>
export const AlertDialogTitle = ({ children }) => <>{children}</>
export const AlertDialogDescription = ({ children }) => <>{children}</>
export const AlertDialogFooter = ({ children }) => <>{children}</>
export const AlertDialogAction = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
)
export const AlertDialogCancel = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
)

export { AlertDialog }
export default AlertDialog
