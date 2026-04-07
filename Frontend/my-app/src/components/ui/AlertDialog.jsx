import React from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { cn } from '../../utils/cn'; // Tailwind merge helper

/**
 * USAGE:
 *
 * <AlertDialog open={isOpen} onClose={() => setIsOpen(false)}>
 *   <AlertDialogHeader>
 *     <AlertDialogTitle>Are you sure?</AlertDialogTitle>
 *     <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
 *   </AlertDialogHeader>
 *   <AlertDialogFooter>
 *     <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
 *     <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
 *   </AlertDialogFooter>
 * </AlertDialog>
 */

/** ── Root AlertDialog ─────────────────────────────────── **/
export function AlertDialog({ open, onClose, children, className }) {
    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <div
                role="alertdialog"
                aria-modal="true"
                className={cn(
                    'bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative',
                    className
                )}
            >
                {children}

                {/* Optional Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
        </div>,
        document.body
    );
}

/** ── Header / Title / Description / Footer ───────────── **/

export const AlertDialogHeader = ({ className, ...props }) => (
    <div
        className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
        {...props}
    />
);

export const AlertDialogTitle = ({ className, ...props }) => (
    <h2 className={cn('text-lg font-semibold text-gray-900', className)} {...props} />
);

export const AlertDialogDescription = ({ className, ...props }) => (
    <p className={cn('text-sm text-gray-600', className)} {...props} />
);

export const AlertDialogFooter = ({ className, ...props }) => (
    <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-6', className)} {...props} />
);

/** ── Action / Cancel Buttons ───────────────────────────── **/

export function AlertDialogAction({ onClick, children, className, ...props }) {
    return (
        <Button
            variant="default"
            onClick={onClick}
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}

export function AlertDialogCancel({ onClick, children, className, ...props }) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}

export default AlertDialog;