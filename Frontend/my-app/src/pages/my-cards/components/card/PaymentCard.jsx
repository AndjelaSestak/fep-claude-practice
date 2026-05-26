import CardFace from './CardFace'
import CardActions from './CardActions'
import { getLastFourDigits } from '../../../../utils/formatters'

const CARD_TYPE_MAP = {
  1: 'Visa',
  2: 'Mastercard'
}

const PaymentCard = ({ card }) => {
  const { card_number_masked, account_number, card_type_id, status = 'active' } = card

  const cardNumber = getLastFourDigits(card_number_masked)
  const accountNumber = account_number
  const cardType = CARD_TYPE_MAP[card_type_id] || 'Unknown'
  const isBlocked = ['blocked', 'reported_lost', 'reported_stolen'].includes(status)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-80">
      <CardFace
        cardNumber={cardNumber}
        accountNumber={accountNumber}
        cardType={cardType}
        isBlocked={isBlocked}
      />
      <CardActions card={card} isBlocked={isBlocked} />
    </div>
  )
}

export default PaymentCard
