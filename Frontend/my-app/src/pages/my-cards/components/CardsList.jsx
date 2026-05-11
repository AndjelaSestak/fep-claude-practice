import PaymentCard from './card/PaymentCard'

const CARD_TYPE_MAP = {
  1: 'Visa',
  2: 'Mastercard'
}

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

  if ((cards?.length ?? 0) === 0) return <p className="text-slate-500">You have no cards yet.</p>

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {cards.map((card) => (
        <PaymentCard
          key={card.id}
          cardNumber={card.card_number_masked?.slice(-4)}
          accountNumber={card.account_number}
          cardType={CARD_TYPE_MAP[card.card_type_id] || 'Unknown'}
          status={card.status}
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
