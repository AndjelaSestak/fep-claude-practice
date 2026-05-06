import { cn } from '../../utils/cn'

export function ItemList({
  title,
  description,
  children,
  className,
  emptyMessage = 'No items available.'
}) {
  const isEmpty = !children || (Array.isArray(children) && children.length === 0)

  return (
    <section
      className={cn(
        'rounded-2xl border border-gray-200 bg-surface p-6 shadow-sm font-sans',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>}

          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      )}

      {isEmpty ? (
        <div className="py-10 text-center text-sm text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </section>
  )
}
