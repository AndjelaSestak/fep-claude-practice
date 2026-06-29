import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryKeys'
import { getPaymentAccounts } from '../services/paymentAccountService'

export const usePaymentAccounts = () => {
  const {
    data: accounts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: queryKeys.paymentAccounts.all,
    queryFn: getPaymentAccounts
  })

  return { accounts, isLoading, error }
}
