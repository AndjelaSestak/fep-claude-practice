import { maskAccountNumber, formatBalance } from '../../../utils/formatters'

const PaymentAccountCard = ({ currency, balance, account_number }) => {
  return (
    <div className="bg-primary/10 p-6 rounded-[2.5rem] border border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-200 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/20 px-3 py-1 rounded-full">
          {currency}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold text-gray-800">
          {formatBalance(balance)}{' '}
          <span className="text-sm font-medium text-gray-500">{currency}</span>
        </span>
      </div>

      <div className="mt-auto">
        <span className="text-xs text-gray-400 font-mono tracking-wider">
          {maskAccountNumber(account_number)}
        </span>
      </div>
    </div>
  )
}

export default PaymentAccountCard
