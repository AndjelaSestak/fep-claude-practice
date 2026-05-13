import { cn } from '../../utils/cn'

const Checkbox = ({ label, className, disabled, ...props }) => {
  return (
    <label className={cn('inline-flex items-center gap-2 text-sm', className)}>
      <input
        type="checkbox"
        disabled={disabled}
        className="h-4 w-4 rounded border-border accent-primary"
        {...props}
      />
      {label}
    </label>
  )
}

export default Checkbox
