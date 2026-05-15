import TemplateCard from '../../../components/ui/TemplateCard'

const TemplateSection = ({ label, templates, isRecurring, onExecute, onEdit, onDelete, onActivate, onDeactivate }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
      <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">
        {label}
      </span>
    </div>

    {templates.length > 0 ? (
      <div className="grid grid-cols-3 gap-6">
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            title={t.name}
            provider={t.recipient}
            amount={t.amount}
            currency={t.currency}
            cardType={t.card?.card_type?.name}
            cardNumber={t.card?.card_number_masked}
            isRecurring={isRecurring}
            isActive={t.recurring_transactions?.[0]?.is_active}
            frequency={t.recurring_transactions?.[0]?.frequency}
            onExecute={onExecute ? () => onExecute(t.id) : undefined}
            onEdit={() => onEdit(t)}
            onDelete={() => onDelete(t)}
            onActivate={onActivate ? () => onActivate(t) : undefined}
            onDeactivate={onDeactivate ? () => onDeactivate(t) : undefined}
          />
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-400">No {label.toLowerCase()} yet.</p>
    )}
  </section>
)

export default TemplateSection
