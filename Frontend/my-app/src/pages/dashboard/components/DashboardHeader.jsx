import InfoCard from '../../../components/ui/InfoCard'
import Select from '../../../components/ui/Select'
import useBalance from '../../../hooks/useBalance'

const DashboardHeader = () => {
  const { accountNumber, currencies, selectedCurrency, setSelectedCurrency, displayBalance } =
    useBalance()

  const formattedAccountNumber = accountNumber.match(/.{1,4}/g)?.join(' ') || accountNumber

  const formattedBalance =
    displayBalance !== null
      ? `${selectedCurrency} ${displayBalance.toLocaleString('sr-RS', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
      : 'Loading...'

  return (
    <header className="flex flex-col md:flex-row items-stretch justify-between gap-6">
      <div className="relative bg-primary/10 p-8 rounded-[2.5rem] border border-primary/20 flex-1 flex flex-col justify-center">
        <div className="absolute -left-4 -top-4 w-32 h-32 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute right-10 bottom-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-10 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
            <span className="text-[11px] font-black text-primary-dark uppercase tracking-[0.2em]">
              Live Overview
            </span>
          </div>

          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">Dashboard</h1>

          <p className="text-gray-700 font-semibold opacity-90">
            Welcome back! Here's what's happening with your money.
          </p>

          <p className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
            <span className="font-mono text-sm font-black text-gray-400 tracking-[0.2em]">
              {formattedAccountNumber}
            </span>
          </p>
        </div>
      </div>

      <div className="w-full md:w-96 flex">
        <InfoCard
          title="Total Balance"
          value={formattedBalance}
          action={
            <div className="w-full">
              <Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                options={currencies.map((currency) => ({
                  value: currency.value,
                  label: currency.value
                }))}
                className="bg-transparent border-none text-sm font-bold text-primary-dark w-full"
              />
            </div>
          }
        />
      </div>
    </header>
  )
}

export default DashboardHeader
