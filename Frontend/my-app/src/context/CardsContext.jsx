import { createContext, useContext } from 'react'
import { useCards } from '../hooks/useCards'

const CardsContext = createContext(null)

export const CardsProvider = ({ children }) => {
  const value = useCards()
  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCardsContext = () => {
  const ctx = useContext(CardsContext)
  if (!ctx) throw new Error('useCardsContext must be used within a CardsProvider')
  return ctx
}
