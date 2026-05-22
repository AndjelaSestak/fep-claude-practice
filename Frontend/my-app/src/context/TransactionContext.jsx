import { createContext, useContext } from 'react'
import { useTransactions } from '../hooks/useTransactions'

const TransactionContext = createContext(null)

export const TransactionProvider = ({ children }) => {
  const value = useTransactions()
  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTransactionContext = () => {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactionContext must be used within a TransactionProvider')
  return ctx
}
