import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryKeys'
import { getCurrencies, getExchangeRate, getWalletBalance } from '../services/walletService'

export const useBalance = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('')

  const walletQuery = useQuery({
    queryKey: queryKeys.wallet.walletBalance,
    queryFn: getWalletBalance
  })

  const currenciesQuery = useQuery({
    queryKey: queryKeys.currencies.all,
    queryFn: getCurrencies
  })

  const wallet = walletQuery.data
  const walletCurrency = wallet?.currency
  const walletBalance = wallet?.balance

  const activeCurrency = selectedCurrency || walletCurrency
  const FetchedExchangeRate =
    Boolean(walletCurrency) && Boolean(activeCurrency) && walletCurrency !== activeCurrency

  const exchangeRateQuery = useQuery({
    queryKey: queryKeys.currencies.exchangeRate(walletCurrency, activeCurrency),
    queryFn: () => getExchangeRate(walletCurrency, activeCurrency),
    enabled: FetchedExchangeRate
  })

  const exchangeRate = exchangeRateQuery.data
  let displayBalance = null

  if (walletBalance != null) {
    displayBalance = walletBalance
  }

  if (FetchedExchangeRate && exchangeRate != null) {
    displayBalance = walletBalance * exchangeRate
  }

  return {
    accountNumber: wallet?.account_number ?? '',
    walletBalance,
    walletCurrency,
    currencies: currenciesQuery.data ?? [],
    selectedCurrency: activeCurrency ?? '',
    setSelectedCurrency,
    displayBalance,
    exchangeRate,
    isLoading: walletQuery.isLoading || currenciesQuery.isLoading || exchangeRateQuery.isLoading,
    error: walletQuery.error || currenciesQuery.error || exchangeRateQuery.error
  }
}
