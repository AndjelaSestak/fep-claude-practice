import PaymentCard from './card/PaymentCard'

const CardsList = ({
  cards,
  loading,
  onBlock,
  onUnblock,
  onReportStolen,
  onReportLost,
  onRemove,
  onViewReports
}) => {
  if (loading) return <p className="text-slate-500">Loading cards...</p>

  if (cards.length === 0) return <p className="text-slate-500">You have no cards yet.</p>

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {cards.map((card) => (
        <PaymentCard
          key={card.id}
          card={card}
          onBlock={() => onBlock(card.id)}
          onUnblock={() => onUnblock(card.id)}
          onReportStolen={() => onReportStolen(card.id)}
          onReportLost={() => onReportLost(card.id)}
          onRemove={() => onRemove(card)}
          onViewReports={() => onViewReports(card.id)}
        />
      ))}
    </div>
  )
}

export default CardsList
