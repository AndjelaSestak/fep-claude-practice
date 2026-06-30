import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { queryKeys } from '../lib/queryKeys'
import { getPaymentAccounts } from '../services/paymentAccountService'

export const usePaymentAccounts = () => {
  const {
    data: accounts = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: queryKeys.paymentAccounts.all,
    queryFn: getPaymentAccounts
  })

  useEffect(() => {
    if (isError) toast.error('Failed to load payment accounts. Please try again.')
  }, [isError, error])

  return { accounts, isLoading }
}
