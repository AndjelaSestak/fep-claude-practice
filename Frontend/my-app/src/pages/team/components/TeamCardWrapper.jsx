import { cn } from '../../../utils/cn'

const variantStyles = {
  team: 'w-full min-h-[360px] rounded-3xl border border-border bg-surface p-8 shadow-sm flex flex-col items-center text-center'
}

const TeamCard = ({ children, variant = 'team', className, hover = false }) => {
  return (
    <div
      className={cn(
        variantStyles[variant],
        hover && 'transition-shadow duration-200 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  )
}

export default TeamCard
