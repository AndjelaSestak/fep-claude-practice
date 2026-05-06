import { cn } from '../../utils/cn'

const FormWrapper = ({ children, className }) => {
  return (
    <div
      className={cn(
        'w-full max-w-[540px] rounded-3xl border border-border bg-white p-8 shadow-sm gap-2',
        className
      )}
    >
      {children}
    </div>
  )
}

export default FormWrapper
