import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import Button from './Button'
import { cn } from '../../utils/cn' // Using your cn helper for Tailwind merging

/**
 * Usage:
 * <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Edit Profile</DialogTitle>
 *       <DialogDescription>Make changes to your profile here.</DialogDescription>
 *     </DialogHeader>
 *     <div>Your form or content here</div>
 *     <DialogFooter>
 *       <DialogClose>Cancel</DialogClose>
 *       <Button onClick={handleSave}>Save</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 */

// ── Root ──────────────────────────────────────────────
export function Dialog({ open, onClose, children }) {
  if (!open) return null

  return createPortal(
    <div data-slot="dialog">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { onClose }) : child
      )}
    </div>,
    document.body
  )
}

// ── Content ───────────────────────────────────────────
export function DialogContent({ className, children, onClose, ...props }) {
  const contentRef = useRef(null)

  // Helper to close the dialog
  const close = () => onClose?.()

  // Focus first button/input & lock body scroll
  useEffect(() => {
    contentRef.current?.querySelector('button, input')?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0" onClick={close} />

      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-6 shadow-xl animate-in zoom-in-95',
          className
        )}
        {...props}
      >
        {children}

        {/* X Close Button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 opacity-70 hover:opacity-100 p-1 outline-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}

// ── Simple Wrappers ───────────────────────────────────
export const DialogHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col gap-2 text-left', className)} {...props} />
)

export const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn('text-lg font-semibold text-[#1B1B1B]', className)} {...props} />
)

export const DialogDescription = ({ className, ...props }) => (
  <p className={cn('text-sm text-slate-600', className)} {...props} />
)

export const DialogFooter = ({ className, ...props }) => (
  <div className={cn('flex justify-end gap-2 mt-6', className)} {...props} />
)

// ── DialogClose (Reusable button to trigger closing) ──
export function DialogClose({ children, onClose, variant = 'outline', ...props }) {
  return (
    <Button variant={variant} onClick={onClose} {...props}>
      {children}
    </Button>
  )
}

export default Dialog
