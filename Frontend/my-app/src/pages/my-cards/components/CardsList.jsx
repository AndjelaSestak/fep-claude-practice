import PaymentCard from './card/PaymentCard'

const CardsList = ({ cards, loading }) => {
  if (loading) return <p className="text-slate-500">Loading cards...</p>

  if (cards.length === 0) return <p className="text-slate-500">You have no cards yet.</p>

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {cards.map((card) => (
        <PaymentCard key={card.id} card={card} />
      ))}
    </div>
  )
}

export default CardsList
