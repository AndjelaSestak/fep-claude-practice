import CardFace from './CardFace'
import CardActions from './CardActions'

const PaymentCard = ({
  cardNumber,
  accountNumber,
  cardType,
  status = 'verified',
  onBlock,
  onUnblock,
  onReportStolen,
  onReportLost,
  onRemove,
  onViewReports
}) => {
  const isBlocked = ['blocked', 'reported_lost', 'reported_stolen'].includes(status)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-80">
      <CardFace
        cardNumber={cardNumber}
        accountNumber={accountNumber}
        cardType={cardType}
        isBlocked={isBlocked}
      />
      <CardActions
        isBlocked={isBlocked}
        onBlock={onBlock}
        onUnblock={onUnblock}
        onReportLost={onReportLost}
        onReportStolen={onReportStolen}
        onViewReports={onViewReports}
        onRemove={onRemove}
      />
    </div>
  )
}

export default PaymentCard
