import Sidebar from '../../components/layout/SideBar'
import NavBarAfterLogin from '../../components/layout/NavBarAfterLogin'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'
import PaymentAccountCard from './components/PaymentAccountCard'
import { usePaymentAccounts } from '../../hooks/usePaymentAccounts'

const PaymentAccountsPage = () => {
  const { accounts, isLoading } = usePaymentAccounts()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBarAfterLogin />
        <main className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader
              label="Accounts"
              title="Payment Accounts"
              subtitle="All your payment accounts at a glance"
            >
              <Button variant="outline" size="sm" disabled>
                Export
              </Button>
            </PageHeader>

            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-[2.5rem] h-40 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!isLoading && accounts.length === 0 && (
              <div className="text-gray-400 text-sm">No payment accounts found.</div>
            )}

            {!isLoading && accounts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <PaymentAccountCard
                    key={account.id}
                    currency={account.currency}
                    balance={account.balance}
                    account_number={account.account_number}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default PaymentAccountsPage
