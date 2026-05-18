import { createContext, useContext } from 'react'
import { useTemplates } from '../hooks/useTemplates'

const TemplatesContext = createContext(null)

export const TemplatesProvider = ({ children }) => {
  const value = useTemplates()
  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTemplatesContext = () => {
  const ctx = useContext(TemplatesContext)
  if (!ctx) throw new Error('useTemplatesContext must be used within a TemplatesProvider')
  return ctx
}
