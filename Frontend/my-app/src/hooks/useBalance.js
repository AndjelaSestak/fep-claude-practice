import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../lib/queryKeys'
import { getCurrencies, getExchangeRate, getWalletBalance } from '../services/walletService'

export const useBalance = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('')

  const {
    data: wallet,
    isLoading: isWalletLoading,
    error: walletError
  } = useQuery({
    queryKey: queryKeys.wallet.walletBalance,
    queryFn: getWalletBalance
  })

  const {
    data: currencies = [],
    isLoading: isCurrenciesLoading,
    error: currenciesError
  } = useQuery({
    queryKey: queryKeys.currencies.all,
    queryFn: getCurrencies
  })

  const walletCurrency = wallet?.currency
  const walletBalance = wallet?.balance

  const activeCurrency = selectedCurrency || walletCurrency
  const shouldFetchExchangeRate = Boolean(walletCurrency && walletCurrency !== activeCurrency)

  const {
    data: exchangeRate,
    isLoading: isExchangeRateLoading,
    error: exchangeRateError
  } = useQuery({
    queryKey: queryKeys.currencies.exchangeRate(walletCurrency, activeCurrency),
    queryFn: () => getExchangeRate(walletCurrency, activeCurrency),
    enabled: shouldFetchExchangeRate
  })

  const hasWalletBalance = walletBalance != null
  const hasExchangeRate = exchangeRate != null
  const displayBalance = !hasWalletBalance
    ? null
    : shouldFetchExchangeRate && hasExchangeRate
      ? walletBalance * exchangeRate
      : walletBalance

  return {
    accountNumber: wallet?.account_number ?? '',
    walletBalance,
    walletCurrency,
    currencies,
    selectedCurrency: activeCurrency ?? '',
    setSelectedCurrency,
    displayBalance,
    exchangeRate,
    isLoading: isWalletLoading || isCurrenciesLoading || isExchangeRateLoading,
    error: walletError || currenciesError || exchangeRateError
  }
}
